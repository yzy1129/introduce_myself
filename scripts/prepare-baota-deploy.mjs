import { access, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "..");
const outputDir = path.join(root, "baota_site_root");

const nginxRewrite = `location / {
    try_files $uri $uri/ /index.html;
}
`;

const apacheRewrite = `<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
`;

const deployGuide = `宝塔上传说明

1. 将当前文件夹中的全部文件上传到宝塔站点根目录，或者直接把站点根目录指向当前文件夹。
2. 如果宝塔站点使用 Nginx，请把 baota-nginx-rewrite.conf 里的规则粘贴到站点伪静态配置中。
3. 如果宝塔站点使用 Apache，可直接保留当前目录下的 .htaccess。
4. 这个项目是前端单页应用，必须保证未命中文件时回退到 /index.html，否则刷新子页面会出现 404。
5. 当前产物按站点根目录部署设计，不要放到二级子目录下运行。
`;

function getFormatHost() {
  return {
    getCanonicalFileName: (fileName) => fileName,
    getCurrentDirectory: () => root,
    getNewLine: () => ts.sys.newLine,
  };
}

function runTypeCheck(configFileName) {
  const configPath = path.join(root, configFileName);
  const configFile = ts.readConfigFile(configPath, ts.sys.readFile);

  if (configFile.error) {
    throw new Error(
      ts.formatDiagnosticsWithColorAndContext([configFile.error], getFormatHost()),
    );
  }

  const parsed = ts.parseJsonConfigFileContent(
    configFile.config,
    ts.sys,
    root,
    undefined,
    configPath,
  );

  if (parsed.errors.length > 0) {
    throw new Error(
      ts.formatDiagnosticsWithColorAndContext(parsed.errors, getFormatHost()),
    );
  }

  const program = ts.createProgram({
    rootNames: parsed.fileNames,
    options: parsed.options,
  });
  const diagnostics = ts.getPreEmitDiagnostics(program);

  if (diagnostics.length > 0) {
    throw new Error(
      ts.formatDiagnosticsWithColorAndContext(diagnostics, getFormatHost()),
    );
  }
}

await rm(outputDir, { recursive: true, force: true });
await mkdir(outputDir, { recursive: true });

runTypeCheck("tsconfig.app.json");
runTypeCheck("tsconfig.node.json");

process.env.BUILD_OUTPUT_DIR = outputDir;
await import(new URL(`./build.mjs?baota=${Date.now()}`, import.meta.url));

try {
  await access(path.join(outputDir, "index.html"));
} catch {
  throw new Error("宝塔部署目录生成失败，未找到 index.html");
}

const indexHtml = await readFile(path.join(outputDir, "index.html"), "utf8");

await Promise.all([
  writeFile(path.join(outputDir, "404.html"), indexHtml, "utf8"),
  writeFile(path.join(outputDir, "baota-nginx-rewrite.conf"), nginxRewrite, "utf8"),
  writeFile(path.join(outputDir, ".htaccess"), apacheRewrite, "utf8"),
  writeFile(path.join(outputDir, "BAOTA-DEPLOY.txt"), deployGuide, "utf8"),
]);

console.log(`宝塔上传目录已生成：${outputDir}`);
