import { program } from "commander";
import keys from "./commands/keys";

program
  .option("--test")
  .option("-k, --keys <file-path>", "get all keys from a JSON like object");

program.parse();

const options = program.opts();

if (options.test) console.log("test succeed");
if (options.keys) keys(options.keus);
