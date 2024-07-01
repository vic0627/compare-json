var compareJson = (function (exports, path, fs) {
    'use strict';

    const traverseJson = (json, options) => {
        let { cb, deepCount, keys, parentKey, values } = options ?? {};
        if (deepCount)
            deepCount++;
        else
            deepCount = 0;
        keys ??= [];
        values ??= [];
        parentKey ??= "";
        for (const key in json) {
            if (!json.hasOwnProperty(key))
                continue;
            const value = json[key];
            const currentKey = parentKey ? `${parentKey},${key}` : key;
            values.push(value);
            if (!keys.includes(currentKey))
                keys.push(currentKey);
            if (typeof cb === "function")
                cb(key, value, deepCount, parentKey);
            if (typeof value === "object" && value !== null)
                traverseJson(value, { cb, deepCount, keys, parentKey: currentKey });
        }
    };
    const jsonKeys = (json) => {
        const keys = [];
        traverseJson(json, { keys });
        return keys;
    };

    var PathType;
    (function (PathType) {
        PathType[PathType["DIR"] = 0] = "DIR";
        PathType[PathType["FILE"] = 1] = "FILE";
        PathType[PathType["NULL"] = 2] = "NULL";
    })(PathType || (PathType = {}));

    const checkPathType = (filePath) => new Promise((resolve, rejects) => {
        fs.stat(filePath, (err, stat) => {
            if (err)
                rejects(err);
            else {
                if (stat.isFile())
                    resolve(PathType.FILE);
                else if (stat.isDirectory())
                    resolve(PathType.DIR);
                else
                    resolve(PathType.NULL);
            }
        });
    });
    const readFile = (path, encoding = "utf8") => new Promise((resolve, rejects) => {
        fs.readFile(path, encoding, (err, data) => {
            if (err)
                rejects(err);
            else
                resolve(data);
        });
    });
    const readFileAsFileObject = async (filePath) => {
        const lastSlash = filePath.lastIndexOf("/");
        const name = filePath.slice(lastSlash);
        const path = filePath.replace(name, "");
        const fileObject = {
            data: await readFile(filePath),
            path,
            name,
        };
        return fileObject;
    };
    const readDir = (dirPath) => new Promise((resolve, rejects) => {
        fs.readdir(dirPath, async (err, files) => {
            if (err)
                rejects(err);
            else {
                const fileObjects = [];
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
    var readFile$1 = async (filePath) => {
        if (typeof filePath !== "string")
            throw new TypeError("filePath must be string");
        const pathType = await checkPathType(filePath);
        if (pathType === PathType.FILE) {
            return await readFileAsFileObject(filePath);
        }
        else
            return await readDir(filePath);
    };

    var readFile$2 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        checkPathType: checkPathType,
        default: readFile$1,
        readDir: readDir,
        readFile: readFile,
        readFileAsFileObject: readFileAsFileObject
    });

    exports.fileOrDir = readFile$2;
    exports.jsonKeys = jsonKeys;
    exports.traverseJson = traverseJson;

    return exports;

})({}, path, fs);
