import React from "react";
import redirect from "@lib/redirect";
import checkLoggedIn from "@lib/checkLoggedIn";
import UserContext from "../contexts/UserContext";
import { GetLoggedInUserMe } from "@types-generated";
import { AppComponentType, AppProps } from "next/app";
import { NextAppContextWithApollo } from "./appWithApollo";

export interface AppWithAuthProps {
  loggedInUser: { user?: GetLoggedInUserMe };
}

const appWithAuth = <P extends {}>(App: AppComponentType<P>) =>
  class WithAuth extends React.Component<P & AppProps & AppWithAuthProps> {
    static displayName = `WithAuth(${App.displayName})`;

    static async getInitialProps(context: NextAppContextWithApollo) {
      let appProps = {};
      if (App.getInitialProps) {
        appProps = await App.getInitialProps(context);
      }

      const { loggedInUser } = await checkLoggedIn(context.ctx.apolloClient);

      if (!loggedInUser.user && context.ctx.pathname !== "/signin") {
        // If not signed in, send them to signin page
        redirect("/signin", context.ctx);
      }

      if (loggedInUser.user && context.ctx.pathname === "/signin") {
        // Already signed in? Throw them back to the main page
        redirect("/", context.ctx);
      }

      return { ...appProps, loggedInUser };
    }

    render() {
      return (
        <UserContext.Provider
          value={this.props.loggedInUser && this.props.loggedInUser.user}
        >
          <App {...this.props} />
        </UserContext.Provider>
      );
    }
  };

export default appWithAuth;
