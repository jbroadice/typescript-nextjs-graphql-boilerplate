import Router from "next/router";
import { NextContext } from "next";

export default (target, context?: NextContext): void => {
  const res = context && context.res;
  if (res) {
    // server
    // 303: "See other"
    res.writeHead(303, { Location: target });
    res.end();
  } else {
    // browser
    Router.replace(target);
  }
};
