import React, { ReactElement } from "react";
import Head from "next/head";

const PageHead: React.FunctionComponent = ({ children }) => (
  <Head>
    {React.Children.map(children, (child: ReactElement<any>) => {
      const { type, props } = child;

      let newProps = {};
      switch (type) {
        case "title":
          newProps = { children: `Test | ${props.children}` };
          break;
      }

      return React.cloneElement(child, { ...props, ...newProps });
    })}
  </Head>
);

export default PageHead;
