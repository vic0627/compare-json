import { program } from "commander";

program.option("--test");

program.parse();

const options = program.opts();

if (options.test) console.log("test succeed");
