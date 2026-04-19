import { createReadStream, existsSync } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "..");
const distDir = path.join(root, "dist");
const port = Number(process.env.PORT ?? 4173);

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

function resolveFilePath(urlPath) {
  const normalizedPath = urlPath === "/" ? "/index.html" : urlPath;
  const safePath = normalizedPath.replace(/^\/+/, "");
  const targetPath = path.join(distDir, safePath);

  if (existsSync(targetPath)) {
    return targetPath;
  }

  return path.join(distDir, "index.html");
}

if (!existsSync(distDir)) {
  console.error("dist 目录不存在，请先运行 npm run build");
  process.exit(1);
}

const server = createServer(async (request, response) => {
  try {
    const requestUrl = new URL(request.url ?? "/", `http://${request.headers.host ?? "localhost"}`);
    const filePath = resolveFilePath(requestUrl.pathname);
    const fileStat = await stat(filePath);

    if (fileStat.isDirectory()) {
      response.writeHead(404);
      response.end("Not found");
      return;
    }

    const extension = path.extname(filePath);
    response.writeHead(200, {
      "Content-Type": mimeTypes[extension] ?? "application/octet-stream",
      "Cache-Control": extension === ".html" ? "no-cache" : "public, max-age=31536000, immutable",
    });

    createReadStream(filePath).pipe(response);
  } catch (error) {
    response.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    response.end(`Server error: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
});

server.listen(port, () => {
  console.log(`数字宇宙预览服务已启动：http://localhost:${port}`);
});
