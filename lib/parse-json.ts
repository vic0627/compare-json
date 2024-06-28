import { JSONLikeObject } from "./types/common";

export const traverseJson = (json: JSONLikeObject, cb?: () => void) => {
  for (const key in json) {
    if (json.hasOwnProperty(key)) {
      const value = json[key];
      if (typeof value === "object" && value !== null) traverseJson(value, cb);
      if (typeof cb === "function") cb(key, value);
    }
  }
};
