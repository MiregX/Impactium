import { HTMLAttributes } from 'react';
import s from './cell.module.css';
import { cn } from '@impactium/utils';

export namespace Cell {
  type DivProps = HTMLAttributes<HTMLDivElement>;

  export interface Props extends DivProps {
    size?: number | `${number}`;
    accent?: string;
    background?: string;
    top?: boolean;
    right?: boolean;
    bottom?: boolean;
    left?: boolean;
  }

  export interface Length {
    length: number;
  }
}

export function Cell({ className, size = 88, accent = 'var(--gray-400)', background, ...props }: Cell.Props) {
  const style = {
    ...props.style,
    borderColor: accent.toString(),
    '--cell-size': size.toString() + 'px',
    top: props.top ? -(size) : void 0,
    right: props.right ? -(size) : void 0,
    bottom: props.bottom ? -(size) : void 0,
    left: props.left ? -(size) : void 0,
    background: background?.toString(),
  }

  if (style.top || style.right || style.bottom || style.left) {
    style.position = 'absolute';
  }

  return (
    <div className={cn(s.cell, className)} style={style} {...props} />
  )
}

export const Cells = ({ length, ...props }: Cell.Props & Cell.Length) => Array.from({ length }).map((_, i) => <Cell key={i} {...props} />)
