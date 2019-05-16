import React, { ComponentClass } from "react";
import { getDataFromTree } from "react-apollo";
import { createNetworkStatusNotifier } from "react-apollo-network-status";
import Head from "next/head";
import initApollo, { ApolloCreateOptions, ApolloCreateReturn } from "@lib/initApollo";
import { ApolloClient } from "apollo-boost";
import { NextContext } from "next";
import { ErrorResponse } from "apollo-link-error";
import { NextAppContext, AppProps, AppComponentType } from "next/app";
import { DefaultQuery } from "next/router";
import { ApolloLink } from "apollo-link";
import { LoonaLink } from "@loona/core";

export interface AppWithApolloProps {
  apolloClient: ApolloClient<{}>;
  loona: LoonaLink;
  NetworkStatusNotifier?: NetworkStatusNotifier;
}

interface OwnProps {
  apolloState: object;
}

export interface NextAppContextWithApollo<Q extends DefaultQuery = DefaultQuery>
  extends NextAppContext {
  ctx: NextContextWithApollo<Q>;
}

export interface NextContextWithApollo<Q extends DefaultQuery = DefaultQuery>
  extends NextContext<Q> {
  apolloClient: ApolloClient<{}>;
}

export interface CreateNetworkStatusNotifier {
  networkStatusNotifierLink: NetworkStatusNotifierLink;
  NetworkStatusNotifier: NetworkStatusNotifier;
}

export interface NetworkStatusNotifierLink extends ApolloLink {}

export interface NetworkStatusNotifier
  extends ComponentClass<{
    render(props: NetworkStatusNotifierRenderProps): JSX.Element;
  }> {}

export interface NetworkStatusNotifierRenderProps {
  loading: boolean;
  error?: ErrorResponse;
}

const appWithApollo = <P extends {}>(
  App: AppComponentType<AppProps & AppWithApolloProps, P, NextAppContextWithApollo>,
) =>
  class WithData extends React.Component<P & AppProps & AppWithApolloProps & OwnProps> {
    static displayName = `WithData(${App.displayName})`;

    NetworkStatusNotifier: NetworkStatusNotifier;

    apolloClients: ApolloCreateReturn;

    static async getInitialProps(context: NextAppContextWithApollo) {
      const {
        Component,
        router,
        ctx: { req, res },
      } = context;

      const headers = req && req.headers;
      const { apollo, loona } = initApollo(
        {},
        {
          headers,
          res,
        },
      );

      context.ctx.apolloClient = apollo;

      let appProps = {};
      if (App.getInitialProps) {
        appProps = await App.getInitialProps(context);
      }

      if (res && res.finished) {
        // When redirecting, the response is finished.
        // No point in continuing to render
        return {};
      }

      if (!process.browser) {
        // Run all graphql queries in the component tree
        // and extract the resulting data
        try {
          // Run all GraphQL queries
          await getDataFromTree(
            <App
              {...appProps}
              Component={Component}
              router={router}
              apolloClient={apollo}
              loona={loona}
            />,
          );
        } catch (error) {
          // Prevent Apollo Client GraphQL errors from crashing SSR.
          // Handle them in components via the data.error prop:
          // https://www.apollographql.com/docs/react/api/react-apollo.html#graphql-query-data-error
          console.error("Error while running `getDataFromTree`", error);
        }

        // getDataFromTree does not call componentWillUnmount
        // head side effect therefore need to be cleared manually
        Head.rewind();
      }

      // Extract query data from the Apollo's store
      const apolloState = apollo.cache.extract();

      return {
        ...appProps,
        apolloState,
      };
    }

    constructor(props: P & AppProps & AppWithApolloProps & OwnProps) {
      super(props);

      let apolloOptions: ApolloCreateOptions = {};

      const networkStatusNotifier: CreateNetworkStatusNotifier = process.browser
        ? createNetworkStatusNotifier()
        : null;

      if (networkStatusNotifier) {
        apolloOptions.networkStatusNotifierLink =
          networkStatusNotifier.networkStatusNotifierLink;

        this.NetworkStatusNotifier = networkStatusNotifier.NetworkStatusNotifier;
      }

      // `getDataFromTree` renders the component first, the client is passed off as a property.
      // After that rendering is done using Next's normal rendering pipeline
      this.apolloClients = initApollo(props.apolloState, apolloOptions);
    }

    render() {
      return (
        <App
          {...this.props}
          apolloClient={this.apolloClients.apollo}
          loona={this.apolloClients.loona}
          NetworkStatusNotifier={this.NetworkStatusNotifier}
        />
      );
    }
  };

export default appWithApollo;
