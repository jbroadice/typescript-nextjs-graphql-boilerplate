import React from "react";
import { AppComponentType, AppProps, NextAppContext } from "next/app";

const appWithServiceWorker = <P extends {}>(App: AppComponentType<P>) =>
  class WithServiceWorker extends React.Component<P & AppProps> {
    static displayName = `WithServiceWorker(${App.displayName})`;

    static async getInitialProps(context: NextAppContext) {
      let appProps = {};
      if (App.getInitialProps) {
        appProps = await App.getInitialProps(context);
      }

      return { ...appProps };
    }

    componentDidMount() {
      if (location.protocol === "https:" && "serviceWorker" in navigator) {
        navigator.serviceWorker.register("/service-worker.js").catch((err) => {
          console.warn("service worker registration failed", err.message);
        });
      }
    }

    render() {
      return <App {...this.props} />;
    }
  };

export default appWithServiceWorker;
