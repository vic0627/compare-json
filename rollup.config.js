import path from "path";
import typescript from "@rollup/plugin-typescript";
import babel from "@rollup/plugin-babel";
import nodeResolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import terser from "@rollup/plugin-terser";

const cwd = process.cwd();
const getPath = (...paths) => path.resolve(cwd, ...paths);

export default {
  input: getPath("./lib/index.ts"),
  output: {
    file: getPath(process.env.BIN_FILE),
    format: "cjs",
    intro: "#!/usr/bin/env node\n'use strict';",
    strict: false,
  },
  plugins: [
    commonjs(),
    typescript(),
    babel({
      exclude: "node_modules/*",
      babelHelpers: "bundled",
    }),
    nodeResolve(),
    terser(),
  ],
  treeshake: true,
};
