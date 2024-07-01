import { exec } from "child_process";
import { resolve } from "path";
import dotenv from "dotenv";

dotenv.config();
const root = process.cwd();

export const pkgName = "compare-json";

export const pkgNameCamel = pkgName.replace("-j", "J");

export const getPath = (...paths) => resolve(root, ...paths);

export const clearDir = (path = getPath("dist")) => exec(`rm -r ${path}`);
