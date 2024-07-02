import { rollup } from "rollup";
import rollupConfig from "./rollup-config.js";
import { clearDir, shell } from "./utils.js";
import { exec } from "child_process";

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
  for (const i in tasks) {
    const task = tasks[i];
    console.log(`start to rollup ${task._metaname}...`);
    await build(task);
    for (const outputTask of task.output) {
      console.log(`output dir: ${outputTask.file}`);
    }
    if (needCli && task._metaname === "cli") {
      shell(
        `npm unlink compare-json && chmod +x "${task.output[0].file}" && npm link && echo shell script executed...`,
      );
    }
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
  if (bundle) await bundle.close();
}

async function generateOutputs(bundle, outputOpts) {
  for (const outputOpt of outputOpts) {
    await bundle.write(outputOpt);
    // const { output } = await bundle.generate(outputOpt);
    // for (const chunkOrAsset of output) {
    // if (chunkOrAsset.type === "asset") console.log("Asset", chunkOrAsset);
    // else console.log("Chunk", chunkOrAsset.modules);
    // }
  }
}
