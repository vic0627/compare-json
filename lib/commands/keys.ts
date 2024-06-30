import { jsonKeys } from "@/actions/parse-json";
import readFile from "@/actions/read-file";

export default async (path: string) => {
  const fileObject = await readFile(path);

  if (typeof fileObject === "string") {
    const keys = jsonKeys(JSON.parse(fileObject));
    console.log(`Keys in "${path}":`);
    console.log(keys);
  } else if (Array.isArray(fileObject)) {
    console.log(`Files in "${fileObject[0].path}":`);
    fileObject.forEach(({ path, name, data }) => {
      const keys = jsonKeys(JSON.parse(data));
      console.log(`Keys in "${name}":`);
      console.log(keys);
    });
  } else console.log("No file or dir was found!");
};
