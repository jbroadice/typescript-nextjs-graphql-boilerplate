const nextRoutes = require("next-routes")()
  .add("signin")
  .add("dashboard", "/", "index")
  .add("users", "/users/:page?")
  .add("user", "/users/user/:userId")
  .add("customers")
  .add("dealers")
  .add("subscribers")
  .add("numbers")
  .add("sims")
  .add("sip")
  .add("tool-cdr-export", "/tools/cdr-export", "tools/cdr-export")
  .add("tool-iccid-import", "/tools/iccid-import", "tools/iccid-import");

export default nextRoutes;
export const { routes, Router, Link } = nextRoutes;
