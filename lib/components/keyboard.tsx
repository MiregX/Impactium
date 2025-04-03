import { HTMLAttributes } from 'react';

export namespace Keyboard {
  export interface Props extends HTMLAttributes<HTMLSpanElement> {
    alt?: true;
    meta?: true;
    shift?: true;
    ctrl?: true;
    small?: true
  }
}

export function Keyboard({ alt, meta, shift, ctrl, small, ...props }: Keyboard.Props) {
  return (
    <span>
      
    </span>
  )
}