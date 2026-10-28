// Bundles the server and all runtime dependencies into dist/index.js.
// The published package has no "dependencies", so users install exactly the
// code that was built here, whatever npm version they use (npm 12 dropped
// npm-shrinkwrap.json, so a lockfile can no longer pin a published package).
import { build } from "esbuild";
import { chmodSync, rmSync } from "fs";

rmSync("dist", { recursive: true, force: true });

await build({
  entryPoints: ["index.ts"],
  outfile: "dist/index.js",
  bundle: true,
  platform: "node",
  format: "esm",
  target: "node18",
  legalComments: "eof",
  logLevel: "warning",
  // Bundled CommonJS dependencies call require() for Node built-ins
  banner: {
    js: 'import { createRequire as __createRequire } from "module"; const require = __createRequire(import.meta.url);',
  },
});

chmodSync("dist/index.js", 0o755);
