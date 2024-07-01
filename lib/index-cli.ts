import { program } from "commander";
import keys from "./actions/keys";

program.option("--test");

program
  .command("keys")
  .argument("<paths...>", "Accept paths of a directory or a file.")
  .option(
    "-c, --compare [std-file]",
    "Compare all keys from given JSON like object to [std-file] and print out the differences. If [std-file] does not exist, the first file of <paths...> will be the default value.",
  )
  .action(keys);

program.parse();

const options = program.opts();

if (options.test) console.log("test succeed");
// if (options.keys) keys(options.keys);
