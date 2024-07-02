import { exec } from "child_process";
import { resolve } from "path";
import dotenv from "dotenv";

dotenv.config();
const root = process.cwd();

export const shell = (script) =>
  exec(script, (err, stdout, stderr) => {
    if (err) return console.error(err);
    if (stderr) return console.error(stderr);
    console.log(stdout);
  });

export const pkgName = "compare-json";

export const pkgNameCamel = pkgName.replace("-j", "J");

export const getPath = (...paths) => resolve(root, ...paths);

export const clearDir = (path = getPath("dist")) => {
  shell(`rm -r ${path}`);
  // exec(`echo "dir: ${path} has been removed"`);
};
