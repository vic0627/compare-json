import { jsonKeys } from "@/services/parse-json";
import readFile, { readFileAsFileObject } from "@/services/read-file";
import { CompareResult } from "@/types/keys";
import { FileObject } from "@/types/read-file";
import path from "path";

const compareFileObjectKeys = (
  o1: FileObject,
  o2: FileObject,
): CompareResult => {
  const std = {
    name: path.join(o1.path, o1.name),
    keys: jsonKeys(JSON.parse(o1.data)),
  };
  const obj = {
    name: path.join(o2.path, o2.name),
    keys: jsonKeys(JSON.parse(o2.data)),
  };
};

export default async (
  paths: string[],
  { compare }: { compare?: true | string },
) => {
  const files = (
    await Promise.all(paths.map(async (path) => await readFile(path)))
  ).flat(Number.MAX_SAFE_INTEGER) as FileObject[];

  const stdFIle: FileObject<string> | FileObject<object> | null =
    compare === true
      ? files[0]
      : compare
        ? await readFileAsFileObject(compare)
        : null;
  if (stdFIle) {
    stdFIle.data = JSON.parse(stdFIle.data);
    stdFIle.name = path.join(stdFIle.path, stdFIle.name);
  }

  files.forEach((value) => {
    if (typeof value !== "object" || Array.isArray(value) || value === null)
      return;

    const { path: _path, name, data: _data } = value;
    const data = JSON.parse(_data);
    console.log(`FIle: ${path.join(_path, name)}, Keys: `, jsonKeys(data));
    // console.log(jsonKeys(data));
  });
};
