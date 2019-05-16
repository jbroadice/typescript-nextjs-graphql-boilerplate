import gql from "graphql-tag";
import { ApolloClient } from "apollo-boost";
import { GetLoggedInUserQuery, GetLoggedInUserMe } from "@types-generated";

interface ReturnType {
  loggedInUser: LoggedInUserType;
}

interface LoggedInUserType {
  user?: GetLoggedInUserMe;
}

export default (apolloClient: ApolloClient<{}>): Promise<ReturnType> =>
  apolloClient
    .query({
      query: gql`
        query getLoggedInUser {
          me {
            id
            firstName
            lastName
          }
        }
      `,
    })
    .then(({ data }: { data: Partial<GetLoggedInUserQuery> }) => {
      return { loggedInUser: data.me && { user: data.me } };
    })
    .catch(() => {
      // Fail gracefully
      return { loggedInUser: {} };
    });
