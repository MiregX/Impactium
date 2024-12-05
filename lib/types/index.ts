import React from "react";

export type Callback<T> = (data: T) => void;

export enum Side {
  TOP = 'top',
  RIGHT = 'right',
  BOTTOM = 'bottom',
  LEFT = 'left'
}

type Color_Var = `var(--${string})`;
type Color_Hex =
  | `#${string}`
  | `#${string}${string}`
  | `#${string}${string}${string}`
  | `#${string}${string}${string}${string}`
  | `#${string}${string}${string}${string}${string}`
  | `#${string}${string}${string}${string}${string}${string}`;

export type Color = Color_Hex | Color_Var

export type MaybeArray<K> = K | K[];

export type SetState<T = unknown> = React.Dispatch<React.SetStateAction<T>>