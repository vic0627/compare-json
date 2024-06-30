import path from "path";
import fs from "fs";
import { FileObject } from "@/types/read-file";

export const readFile = (path: string, encoding: BufferEncoding = "utf8") =>
  new Promise<string>((resolve, rejects) => {
    fs.readFile(path, encoding, (err, data) => {
      if (err) rejects(err);
      else resolve(data);
    });
  });

export const readDir = (dirPath: string) =>
  new Promise<FileObject[]>((resolve, rejects) => {
    fs.readdir(dirPath, (err, files) => {
      if (err) rejects(err);
      else {
        const filesPromise = files.map(async (name) => {
          const fullPath = path.join(dirPath, name);
          const data = await readFile(fullPath);
          return { name, path: dirPath, data } as FileObject;
        });
        resolve(Promise.all(filesPromise));
      }
    });
  });

export default async (filePath: string) => {
  if (
    filePath.endsWith(".json") ||
    filePath.endsWith(".xlsx") ||
    filePath.endsWith(".csv")
  )
    return await readFile(filePath);
  else return await readDir(filePath);
};
