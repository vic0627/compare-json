import path from "path";
import fs from "fs";
import { FileObject, PathType } from "@/types/read-file";

export const checkPathType = (filePath: string) =>
  new Promise<PathType>((resolve, rejects) => {
    fs.stat(filePath, (err, stat) => {
      if (err) rejects(err);
      else {
        if (stat.isFile()) resolve(PathType.FILE);
        else if (stat.isDirectory()) resolve(PathType.DIR);
        else resolve(PathType.NULL);
      }
    });
  });

export const readFile = (path: string, encoding: BufferEncoding = "utf8") =>
  new Promise<string>((resolve, rejects) => {
    fs.readFile(path, encoding, (err, data) => {
      if (err) rejects(err);
      else resolve(data);
    });
  });

export const readFileAsFileObject = async (filePath: string) => {
  const lastSlash = filePath.lastIndexOf("/");
  const name = filePath.slice(lastSlash);
  const path = filePath.replace(name, "");
  const fileObject: FileObject = {
    data: await readFile(filePath),
    path,
    name,
  };
  return fileObject;
};

export const readDir = (dirPath: string) =>
  new Promise<FileObject[]>((resolve, rejects) => {
    fs.readdir(dirPath, async (err, files) => {
      if (err) rejects(err);
      else {
        const fileObjects: FileObject[] = [];
        for (const name of files) {
          const fullPath = path.join(dirPath, name);
          const pathType = await checkPathType(fullPath);

          if (pathType === PathType.FILE)
            fileObjects.push(await readFileAsFileObject(fullPath));
          else if (pathType === PathType.DIR)
            fileObjects.push(...(await readDir(fullPath)));
        }
        resolve(fileObjects);
      }
    });
  });

export default async (filePath: string) => {
  if (typeof filePath !== "string")
    throw new TypeError("filePath must be string");

  const pathType = await checkPathType(filePath);

  if (pathType === PathType.FILE) {
    return await readFileAsFileObject(filePath);
  } else return await readDir(filePath);
};
