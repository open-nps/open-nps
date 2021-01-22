declare type Primitives =
  | string
  | boolean
  | number
  | date
  | string[]
  | boolean[]
  | number[]
  | date[];
declare type Any = Primitives | AnyObject;
declare type AnyObject = Record<string, Any>; // eslint-disable-line
declare type SimpleFn<Param, Return> = (a: Param) => Return;
