import { ApolloClient, InMemoryCache, Observable, ApolloLink } from "apollo-boost";
import { createHttpLink } from "apollo-link-http";
import { setContext } from "apollo-link-context";
import { onError } from "apollo-link-error";
import { createLoona, LoonaLink } from "@loona/react";
import {
  IntrospectionFragmentMatcher,
  NormalizedCacheObject,
} from "apollo-cache-inmemory";
import introspectionQueryResultData from "../../typescript-graphql-modules-api/build/fragmentTypes.json";
import fetch from "isomorphic-unfetch";
import getApiHost from "./getApiHost";
import getTokenFromCookie from "./getTokenFromCookie";
import refreshToken from "./refreshToken";
import { ServerResponse, IncomingHttpHeaders } from "http";

export interface ApolloCreateOptions {
  headers?: IncomingHttpHeaders;
  res?: ServerResponse;
  networkStatusNotifierLink?: ApolloLink;
}

export interface ApolloCreateReturn {
  apollo: ApolloClient<NormalizedCacheObject>;
  loona: LoonaLink;
}

let createdClients: ApolloCreateReturn = null;

// Polyfill fetch() on the server (used by apollo-client)
if (!process.browser) {
  global.fetch = fetch;
}

function create(
  initialState,
  { headers, res, networkStatusNotifierLink }: ApolloCreateOptions,
): ApolloCreateReturn {
  /**
   * Introspection Fragment Matcher (for referencing interfaces on fragments / unions)
   */
  const fragmentMatcher = new IntrospectionFragmentMatcher({
    introspectionQueryResultData,
  });

  /**
   * In-memory cache
   */
  const cache = new InMemoryCache({
    fragmentMatcher,
  }).restore(initialState || {});

  /**
   * Main HTTP link
   */
  const httpLink = createHttpLink({
    uri: `${getApiHost()}/graphql`,
    credentials: "same-origin",
  });

  /**
   * Client Awareness
   */
  const clientAwarenessLink = setContext((_request, { clientAwareness }) => ({
    headers: {
      "client-name": (clientAwareness && clientAwareness.name) || "Unknown Client",
      "client-version": (clientAwareness && clientAwareness.version) || "Unversioned",
    },
  }));

  /**
   * Authentication
   */
  const authLink = setContext((_request, context) => {
    const tokens = getTokenFromCookie(headers);
    return tokens
      ? {
          headers: {
            ...context.headers,
            authorization: tokens.token ? `Bearer ${tokens.token}` : "",
          },
        }
      : null;
  });

  /**
   * Error handling / JWT token refresh & retry
   */
  const authErrorRetryLink = onError(({ graphQLErrors, operation, forward }) => {
    if (graphQLErrors) {
      for (let err of graphQLErrors) {
        switch (err.extensions.code) {
          case "UNAUTHENTICATED":
            const tokensFromCookie = getTokenFromCookie(headers);

            if (tokensFromCookie) {
              // Let's refresh token through async request
              return new Observable((observer) => {
                refreshToken(tokensFromCookie, { headers, res })
                  .then((refreshResponse) => {
                    if (!refreshResponse.token) {
                      throw new Error(
                        "[JWT token refresh]: Could not refresh auth token",
                      );
                    }

                    operation.setContext({
                      headers: {
                        authorization: `Bearer ${refreshResponse.token}`,
                      },
                    });
                  })
                  .then(() => {
                    const subscriber = {
                      next: observer.next.bind(observer),
                      error: observer.error.bind(observer),
                      complete: observer.complete.bind(observer),
                    };

                    // Retry last failed request
                    forward(operation).subscribe(subscriber);
                  })
                  .catch((error) => {
                    // No refresh or client token available, we force user to login
                    observer.error(error);
                  });
              });
            }
        }
      }
    }
  });

  /**
   * Loona state management
   */
  const loonaLink = createLoona(cache);

  let link = ApolloLink.from([
    authErrorRetryLink,
    clientAwarenessLink,
    authLink,
    loonaLink,
    httpLink,
  ]);

  if (networkStatusNotifierLink) {
    link = networkStatusNotifierLink.concat(link);
  }

  // Check out https://github.com/zeit/next.js/pull/4611 if you want to use the AWSAppSyncClient
  const apollo = new ApolloClient({
    connectToDevTools: process.browser,
    ssrMode: !process.browser, // Disables forceFetch on the server (so queries are only run once)
    cache,
    link,
    name: "My Web Frontend",
    version: "0.0.1",
  });

  return { apollo, loona: loonaLink };
}

export default function initApollo(
  initialState: object,
  options: ApolloCreateOptions,
): ApolloCreateReturn {
  // Make sure to create a new client for every server-side request so that data
  // isn't shared between connections (which would be bad)
  if (!process.browser) {
    return create(initialState, options);
  }

  // Reuse client on the client-side
  if (!createdClients) {
    createdClients = create(initialState, options);
  }

  return createdClients;
}
