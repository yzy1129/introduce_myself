import { cp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import crypto from "node:crypto";
import { rollup } from "rollup";
import alias from "@rollup/plugin-alias";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";

function inlineBrowserEnv() {
  const processShim = [
    'const process = globalThis.process || {',
    '  env: { NODE_ENV: "production" },',
    '  emit() {},',
    '};',
    'globalThis.process = process;',
    "",
  ].join("\n");

  return {
    name: "inline-browser-env",
    renderChunk(code) {
      return {
        code:
          processShim +
          code
            .replace(/\bprocess\.env\.NODE_ENV\b/g, JSON.stringify("production"))
            .replace(/\bprocess\.env\b/g, '{"NODE_ENV":"production"}'),
        map: null,
      };
    },
  };
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "..");
const outputDir = process.env.BUILD_OUTPUT_DIR;
const buildVersion = Date.now().toString();
const releaseMarker = `BAOTA_RELEASE_${buildVersion}`;
const dist = outputDir
  ? path.isAbsolute(outputDir)
    ? outputDir
    : path.join(root, outputDir)
  : path.join(root, "dist");
const assetsDir = path.join(dist, "assets");

await rm(dist, { recursive: true, force: true });
await mkdir(assetsDir, { recursive: true });

const bundle = await rollup({
  input: path.join(root, "src", "main.tsx"),
  plugins: [
    alias({
      entries: [{ find: "@", replacement: path.join(root, "src") }],
    }),
    resolve({
      browser: true,
      extensions: [".mjs", ".js", ".jsx", ".json", ".ts", ".tsx"],
    }),
    commonjs(),
    typescript({
      tsconfig: path.join(root, "tsconfig.app.json"),
      declaration: false,
      declarationMap: false,
      noEmitOnError: true,
    }),
    inlineBrowserEnv(),
  ],
  onwarn(warning, warn) {
    if (warning.code === "MODULE_LEVEL_DIRECTIVE") {
      return;
    }

    warn(warning);
  },
});

await bundle.write({
  file: path.join(assetsDir, "app.js"),
  format: "es",
});

await bundle.close();
await cp(path.join(root, "src", "styles", "index.css"), path.join(assetsDir, "index.css"));

try {
  const publicDir = path.join(root, "public");
  const publicEntries = await readdir(publicDir);

  await Promise.all(
    publicEntries.map((entry) =>
      cp(path.join(publicDir, entry), path.join(dist, entry), {
        recursive: true,
        force: true,
      }),
    ),
  );
} catch {}

const html = await readFile(path.join(root, "index.html"), "utf8");
const builtHtml = html
  .replace("<!doctype html>", `<!doctype html>\n<!-- ${releaseMarker} -->`)
  .replace(
    '<link rel="stylesheet" href="/src/styles/index.css" />',
    `<link rel="stylesheet" href="./assets/index.css?v=${buildVersion}" />`,
  )
  .replace(
    '<script type="module" src="/src/main.tsx"></script>',
    [
      '<script>',
      'var process = globalThis.process || {',
      '  env: { NODE_ENV: "production" },',
      '  emit() {},',
      '};',
      'globalThis.process = process;',
      "</script>",
      `<script type="module" src="./assets/app.js?v=${buildVersion}"></script>`,
    ].join(""),
  );

await writeFile(path.join(dist, "index.html"), builtHtml, "utf8");

const appJs = await readFile(path.join(assetsDir, "app.js"), "utf8");
const appJsHash = crypto.createHash("sha256").update(appJs).digest("hex");

await writeFile(
  path.join(dist, "release.json"),
  JSON.stringify(
    {
      releaseMarker,
      buildVersion,
      appJsSha256: appJsHash,
      generatedAt: new Date().toISOString(),
    },
    null,
    2,
  ),
  "utf8",
);
