import cookie from "cookie";
import redirect from "./redirect";
import { ApolloClient } from "apollo-boost";

const signout = (apolloClient: ApolloClient<{}>) => () => {
  const expireCookieOpts = {
    maxAge: -1,
  };

  document.cookie = cookie.serialize("token", "", expireCookieOpts);
  document.cookie = cookie.serialize("refreshToken", "", expireCookieOpts);

  // Force a reload of all the current queries now that the user is
  // logged in, so we don't accidentally leave any state around.
  apolloClient.cache.reset().then(() => {
    // Redirect to a more useful page when signed out
    redirect("/signin");
  });
};

export default signout;
