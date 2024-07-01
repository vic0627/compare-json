export type FileObject<T = string> = {
  data: T;
  name: string;
  path: string;
};

export enum PathType {
  DIR,
  FILE,
  NULL,
}
