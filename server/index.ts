import { createServer } from "http";
import { join, resolve } from "path";
import { parse } from "url";
import * as next from "next";
import routes from "./routes";

const rootPath = resolve(".");
const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const routesHandler = routes.getRequestHandler(app);

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    const { pathname } = parsedUrl;

    const rootStaticFiles = ["/robots.txt", "/sitemap.xml", "/favicon.ico"];

    if (rootStaticFiles.indexOf(pathname) > -1) {
      const path = join(rootPath, "static", parsedUrl.pathname);
      app.serveStatic(req, res, path);
    } else if (pathname === "/service-worker.js") {
      const filePath = join(rootPath, ".next", pathname);
      app.serveStatic(req, res, filePath);
    } else {
      routesHandler(req, res);
    }
  }).listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
