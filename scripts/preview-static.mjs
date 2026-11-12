import { createServer } from "node:http";
import { readFile, realpath, stat } from "node:fs/promises";
import { extname, isAbsolute, relative, resolve, sep } from "node:path";
import { parseArgs } from "node:util";

const { values, positionals } = parseArgs({
  options: {
    port: { type: "string", default: "3100" },
    identity: { type: "string" },
  },
  allowPositionals: true,
});
if (positionals.length !== 1)
  throw new Error("Usage: preview-static.mjs <output> [--port 3100]");
const root = await realpath(resolve(positionals[0]));
const port = Number(values.port);
if (!Number.isInteger(port) || port < 1 || port > 65535)
  throw new Error("Invalid preview port");

const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

function insideRoot(path) {
  const child = relative(root, path);
  return child !== ".." && !child.startsWith(`..${sep}`) && !isAbsolute(child);
}

async function findFile(pathname) {
  const path = resolve(root, `.${pathname}`);
  if (!insideRoot(path)) return null;
  const candidates = pathname.endsWith("/")
    ? [resolve(path, "index.html")]
    : [path, `${path}.html`, resolve(path, "index.html")];
  for (const candidate of candidates) {
    try {
      const actual = await realpath(candidate);
      if (insideRoot(actual) && (await stat(actual)).isFile()) return actual;
    } catch (error) {
      if (!["ENOENT", "ENOTDIR"].includes(error.code)) throw error;
    }
  }
  return null;
}

const server = createServer(async (request, response) => {
  try {
    if (values.identity) response.setHeader("X-Visual-Source", values.identity);
    if (request.method !== "GET" && request.method !== "HEAD") {
      response.writeHead(405, { Allow: "GET, HEAD" }).end();
      return;
    }
    let pathname;
    try {
      pathname = decodeURIComponent(
        new URL(request.url, "http://localhost").pathname,
      );
      if (pathname.includes("\0")) throw new Error("Invalid path");
    } catch {
      response.writeHead(400).end();
      return;
    }
    const requested = await findFile(pathname);
    const file = requested ?? (await findFile("/404.html"));
    if (!file) {
      response.writeHead(404).end();
      return;
    }
    const body = await readFile(file);
    response.writeHead(requested ? 200 : 404, {
      "Content-Type": contentTypes[extname(file)] ?? "application/octet-stream",
      "Content-Length": body.byteLength,
      "Cache-Control": "no-store",
    });
    response.end(request.method === "HEAD" ? undefined : body);
  } catch (error) {
    console.error(error);
    response.writeHead(500).end();
  }
});

server.listen(port, "localhost", () => {
  console.log(`Static preview: http://localhost:${port} (${root})`);
});
for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => server.close());
}
