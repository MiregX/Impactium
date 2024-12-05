import { HTMLAttributes } from 'react';
import s from './cell.module.css';

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

export function Cell({ className, size, accent = 'var(--gray-400)', background, ...props }: Cell.Props) {
  const basic = 88;

  const style = {
    ...props.style,
    borderColor: accent.toString(),
    '--cell-size': size ?? basic + 'px',
    top: props.top ? -(size ?? basic) : void 0,
    right: props.right ? -(size ?? basic) : void 0,
    bottom: props.bottom ? -(size ?? basic) : void 0,
    left: props.left ? -(size ?? basic) : void 0,
    background: background?.toString(),
  }

  if (style.top || style.right || style.bottom || style.left) {
    style.position = 'absolute';
  }

  return (
    <div className={`${s.cell} ${className}`} style={style} {...props} />
  )
}

export const Cells = ({ length, ...props }: Cell.Props & Cell.Length) => Array.from({ length }).map((_, i) => <Cell key={i} {...props} />)
