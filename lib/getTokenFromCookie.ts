import cookie from "cookie";
import { IncomingHttpHeaders } from "http";

export default function getTokenFromCookie(headers: IncomingHttpHeaders) {
  const cookies: string = process.browser ? document.cookie : headers.cookie;

  if (cookies) {
    const { token, refreshToken } = cookie.parse(cookies);
    return token && refreshToken ? { token, refreshToken } : null;
  }

  return null;
}
