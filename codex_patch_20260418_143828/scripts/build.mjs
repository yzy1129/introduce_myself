import { cp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { rollup } from "rollup";
import alias from "@rollup/plugin-alias";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "..");
const dist = path.join(root, "dist");
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
  .replace('<link rel="stylesheet" href="/src/styles/index.css" />', '<link rel="stylesheet" href="./assets/index.css" />')
  .replace('<script type="module" src="/src/main.tsx"></script>', '<script type="module" src="./assets/app.js"></script>');

await writeFile(path.join(dist, "index.html"), builtHtml, "utf8");
