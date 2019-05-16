import cookie from "cookie";
import { LoginUserLogin } from "@types-generated";
import { ServerContext } from "./refreshToken";

const storeTokens = (
  { token, refreshToken }: LoginUserLogin,
  serverContext?: ServerContext,
) => {
  const cookieOpts = {
    sameSite: true,
    path: "/",
    secure:
      process.env.NODE_ENV === "production" &&
      (!process.browser || (process.browser && window.location.protocol == "https:")),
    maxAge: 30 * 24 * 60 * 60, // 30 days
  };

  const cookies = { token, refreshToken };

  const cookiesSerialized = (withOpts = true) => {
    return Object.keys(cookies).map((key) => {
      const value = cookies[key] || "";
      return withOpts
        ? cookie.serialize(key, value, value !== "" ? cookieOpts : { maxAge: -1 })
        : `${key}=${value}`;
    });
  };

  if (process.browser) {
    cookiesSerialized().forEach((entry) => {
      document.cookie = entry;
    });
  } else {
    serverContext.headers.cookie = cookiesSerialized(false).join("; ");
    serverContext.res.setHeader("Set-Cookie", cookiesSerialized());
  }
};

export default storeTokens;
