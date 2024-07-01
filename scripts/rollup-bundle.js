import { rollup } from "rollup";
import rollupConfig from "./rollup-config.js";
import { clearDir } from "./utils.js";

const action = process.argv[2];
const needCli = process.argv.includes("--cli");
const needLib = process.argv.includes("--lib");

const tasks = [];

if (needCli) tasks.push(rollupConfig.cli);
if (needLib) tasks.push(rollupConfig.lib);

if (action === "build") {
  buildProcess();
} else if (action === "watch") {
  for (const taskName in tasks) {
    const task = tasks[taskName];
    const watchOption = {
      ...task.input,
      output: task.output,
    };
    const watcher = rollup.watch(watchOption);
    watcher.on("event", ({ result }) => {
      if (result) result.close();
    });
  }
} else console.log("Unidentified script action:", action);

async function buildProcess() {
  console.log("build process start");
  clearDir();
  for (const taskName in tasks) {
    console.log(`start to rollup ${taskName}...`);
    const task = tasks[taskName];
    await build(task);
  }
  console.log("build process end");
}

async function build(task) {
  let bundle;
  let buildFailed = false;
  try {
    bundle = await rollup(task.input);

    console.log(bundle.watchFiles);

    await generateOutputs(bundle, task.output);
  } catch (error) {
    buildFailed = true;
    console.error(error);
  }
  if (bundle) {
    await bundle.close();
  }
  process.exit(buildFailed ? 1 : 0);
}

async function generateOutputs(bundle, output) {
  for (const outputOptions of output) {
    const { output } = await bundle.generate(outputOptions);

    // for (const chunkOrAsset of output) {
    // if (chunkOrAsset.type === "asset") console.log("Asset", chunkOrAsset);
    // else console.log("Chunk", chunkOrAsset.modules);
    // }
  }
}
