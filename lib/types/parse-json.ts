export type TraverseJsonOptions<T> = {
  cb?: (
    key: keyof T,
    value: T[keyof T],
    deepCount: number,
    parentKey: string,
  ) => void;
  deepCount?: number;
  keys?: (keyof T)[];
  values?: T[keyof T][];
  parentKey?: string;
};
