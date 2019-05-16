import fetch from "isomorphic-unfetch";
import getApiHost from "./getApiHost";
import storeTokens from "./storeTokens";
import { IncomingHttpHeaders, ServerResponse } from "http";

interface Tokens {
  token: string;
  refreshToken: string;
}

export interface ServerContext {
  headers?: IncomingHttpHeaders;
  res?: ServerResponse;
}

const refreshToken = ({ token, refreshToken }: Tokens, { headers, res }: ServerContext) =>
  fetch(`${getApiHost()}/refresh`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refreshToken }),
  })
    .then((response) => response.json())
    .then((refreshResponse) => {
      storeTokens(refreshResponse, { headers, res });
      return refreshResponse;
    });

export default refreshToken;
