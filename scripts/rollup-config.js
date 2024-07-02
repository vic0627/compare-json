import typescript from "@rollup/plugin-typescript";
import babel from "@rollup/plugin-babel";
import nodeResolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import terser from "@rollup/plugin-terser";
import alias from "@rollup/plugin-alias";
import nodePolyfills from "rollup-plugin-polyfill-node";
import { getPath, pkgName, pkgNameCamel } from "./utils.js";

const plugins = {
  pf: nodePolyfills(),
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

export default {
  /**
   * cli configuration
   */
  cli: {
    _metaname: "cli",
    input: {
      input: getPath("lib/index-cli.ts"),
      plugins: Object.values({ ...plugins, pf: null }).filter((x) => x),
      treeshake: true,
    },
    output: [
      {
        file: getPath(`dist/bin/${pkgName}.cjs`),
        format: "cjs",
        intro: "#!/usr/bin/env node\n'use strict';",
        strict: false,
      },
    ],
  },
  /**
   * normal lib configuration
   */
  lib: {
    _metaname: "lib",
    input: {
      input: getPath("lib/index.ts"),
      plugins: [plugins.pf, plugins.cjs, plugins.ts, plugins.bl, plugins.nr],
      treeshake: true,
    },
    output: [
      {
        file: outputDir("js"),
        format: "iife",
        name: pkgNameCamel,
      },
      {
        file: outputDir("mjs"),
        format: "es",
        name: pkgNameCamel,
      },
      {
        file: outputDir("cjs"),
        format: "cjs",
        name: pkgNameCamel,
      },
      {
        file: outputDir("min.js"),
        format: "iife",
        name: pkgNameCamel,
        plugins: [plugins.tsr],
      },
    ],
  },
};
