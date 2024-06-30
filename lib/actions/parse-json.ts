import { JSONLikeObject } from "../types/common";
import { TraverseJsonOptions } from "../types/parse-json";

export const traverseJson = <T extends JSONLikeObject>(
  json: T,
  options?: TraverseJsonOptions<T>,
) => {
  let { cb, deepCount, keys, parentKey, values } = options ?? {};
  if (deepCount) deepCount++;
  else deepCount = 0;
  keys ??= [];
  values ??= [];
  parentKey ??= "";

  for (const key in json) {
    if (!json.hasOwnProperty(key)) continue;

    const value = json[key];
    const currentKey: string = parentKey ? `${parentKey},${key}` : key;

    values.push(value);
    if (!keys.includes(currentKey)) keys.push(currentKey);
    if (typeof cb === "function") cb(key, value, deepCount, parentKey);
    if (typeof value === "object" && value !== null)
      traverseJson(value, { cb, deepCount, keys, parentKey: currentKey });
  }
};

export const jsonKeys = <T extends JSONLikeObject>(json: T) => {
  const keys: (keyof T)[] = [];
  traverseJson(json, { keys });

  return keys;
};

export const jsonValues = <T extends JSONLikeObject>(json: T) => {
  const values: T[keyof T][] = [];
  traverseJson(json, { values });

  return values;
};
