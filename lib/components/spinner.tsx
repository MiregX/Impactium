import { HTMLAttributes } from 'react';

export namespace Spinner {
  export interface Props extends HTMLAttributes<HTMLSpanElement> {
    alt?: true;
    meta?: true;
    shift?: true;
    ctrl?: true;
    small?: true
  }
}

export function Spinner({ alt, meta, shift, ctrl, small, ...props }: Spinner.Props) {
  return (
    <span>

    </span>
  )
}