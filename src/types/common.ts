/**
 * Common utility types used throughout the application
 */

type Maybe<T> = T | null | undefined;
type Nullable<T> = T | null;
type Optional<T> = T | undefined;

type Dictionary<T> = {
  [key: string]: T;
};

type ValueOf<T> = T[keyof T];

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

export type { Maybe, Nullable, Optional, Dictionary, ValueOf, DeepPartial, Prettify };
