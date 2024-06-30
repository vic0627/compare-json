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

    const readFile = (path, encoding = "utf8") => new Promise((resolve, rejects) => {
        fs.readFile(path, encoding, (err, data) => {
            if (err)
                rejects(err);
            else
                resolve(data);
        });
    });
    const readDir = (dirPath) => new Promise((resolve, rejects) => {
        fs.readdir(dirPath, (err, files) => {
            if (err)
                rejects(err);
            else {
                const filesPromise = files.map(async (name) => {
                    const fullPath = path.join(dirPath, name);
                    const data = await readFile(fullPath);
                    return { name, path: dirPath, data };
                });
                resolve(Promise.all(filesPromise));
            }
        });
    });
    var readFile$1 = async (filePath) => {
        if (filePath.endsWith(".json") ||
            filePath.endsWith(".xlsx") ||
            filePath.endsWith(".csv"))
            return await readFile(filePath);
        else
            return await readDir(filePath);
    };

    var readFile$2 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        default: readFile$1,
        readDir: readDir,
        readFile: readFile
    });

    exports.fileOrDir = readFile$2;
    exports.jsonKeys = jsonKeys;
    exports.traverseJson = traverseJson;

    return exports;

})({}, path, fs);
