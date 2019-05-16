import "@sass/styles.scss";

import React from "react";
import { trim, flowRight } from "lodash-es";
import appWithApollo, {
  NetworkStatusNotifierRenderProps,
  NextAppContextWithApollo,
  AppWithApolloProps,
} from "@hocs/appWithApollo";
import appWithAuth, { AppWithAuthProps } from "@hocs/appWithAuth";
import appWithServiceWorker from "@hocs/appWithServiceWorker";
import App, { Container } from "next/app";
import { ApolloProvider } from "react-apollo";
import MyRootLayout from "@components/layouts/MyRootLayout";
import NProgress from "next-nprogress/component";
import { LoonaProvider } from "@loona/react";
import loonaState from "@states";

class MyApp extends App<AppWithApolloProps & AppWithAuthProps> {
  static async getInitialProps({ Component, ctx }: NextAppContextWithApollo) {
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return { pageProps };
  }

  get pageClassName() {
    let page = this.props.router.route;

    if (page === "/") {
      page = "home";
    }

    return `page page-${trim(page, "/")}`;
  }

  renderLayout = (networkStatus?: NetworkStatusNotifierRenderProps) => {
    const { Component, pageProps, loggedInUser } = this.props;
    return (
      <React.Fragment>
        {networkStatus && networkStatus.loading && (
          <style jsx global>
            {`
              html,
              body,
              body * {
                cursor: progress !important;
              }
            `}
          </style>
        )}
        <div className={this.pageClassName}>
          {loggedInUser.user ? (
            <MyRootLayout>
              <Component {...pageProps} />
            </MyRootLayout>
          ) : (
            <Component {...pageProps} />
          )}
        </div>
      </React.Fragment>
    );
  };

  render() {
    const { apolloClient, loona, NetworkStatusNotifier } = this.props;
    return (
      <Container>
        <NProgress spinner={false} />
        <ApolloProvider client={apolloClient}>
          <LoonaProvider loona={loona} states={loonaState}>
            {NetworkStatusNotifier ? (
              <NetworkStatusNotifier render={this.renderLayout} />
            ) : (
              this.renderLayout()
            )}
          </LoonaProvider>
        </ApolloProvider>
      </Container>
    );
  }
}

export default flowRight(
  appWithApollo,
  appWithAuth,
  appWithServiceWorker,
)(MyApp);
