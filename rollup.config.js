import path from "path";
import typescript from "@rollup/plugin-typescript";
import babel from "@rollup/plugin-babel";
import nodeResolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import terser from "@rollup/plugin-terser";
import alias from "@rollup/plugin-alias";

const cwd = process.cwd();
const getPath = (...paths) => path.resolve(cwd, ...paths);
const pkgName = process.env.BIN_FILE ?? "compare-json";
const plugins = {
  als: alias({
    entries: [
      {
        find: "@/",
        replacement: getPath("lib"),
      },
    ],
  }),
  cjs: commonjs(),
  ts: typescript(),
  bl: babel({ babelHelpers: "bundled" }),
  nr: nodeResolve(),
  tsr: terser(),
};

const outputDir = (format) => getPath("dist", `${pkgName}.${format}`);
const name = pkgName.replace("-j", "J");

export default [
  /**
   * cli configuration
   */
  {
    input: getPath("lib/index-cli.ts"),
    output: {
      file: getPath(`dist/bin/${pkgName}.cjs`),
      format: "cjs",
      intro: "#!/usr/bin/env node\n'use strict';",
      strict: false,
    },
    plugins: Object.values(plugins),
    treeshake: true,
  },
  /**
   * normal lib configuration
   */
  {
    input: getPath("lib/index.ts"),
    output: [
      {
        file: outputDir("js"),
        format: "iife",
        name,
      },
      {
        file: outputDir("mjs"),
        format: "es",
        name,
      },
      {
        file: outputDir("cjs"),
        format: "cjs",
        name,
      },
      {
        file: outputDir("min.js"),
        format: "iife",
        name,
        plugins: [plugins.tsr],
      },
    ],
    plugins: [plugins.cjs, plugins.ts, plugins.bl, plugins.nr],
    treeshake: true,
  },
];
