import { HTMLAttributes } from 'react';
import s from './styles/Cell.module.css';
import { cn } from '@/lib/utils';
import { ChadNumber } from './Skeleton';
import { DesignSystem } from '@impactium/utils';

export namespace Cell {
  type DivProps = HTMLAttributes<HTMLDivElement>;

  export interface Props extends DivProps {
    size?: ChadNumber;
    accent?: DesignSystem.Color;
    background?: DesignSystem.Color;
    top?: boolean;
    right?: boolean;
    bottom?: boolean;
    left?: boolean;
  }

  export interface Length {
    length: number;
  }
}

export function Cell({ className, size, accent = new DesignSystem.Color('gray-400'), background, ...props }: Cell.Props) {
  const basic = 88;

  const style = {
    ...props.style,
    borderColor: accent.toString(),
    '--cell-size': size ?? basic + 'px',
    top: props.top ? -(size ?? basic) : void 0,
    right: props.right ? -(size ?? basic) : void 0,
    bottom: props.bottom ? -(size ?? basic) : void 0,
    left: props.left ? -(size ?? basic) : void 0,
    background: background?.toString()
  }

  return (
    <div className={cn(s.cell, className)} style={style} {...props} />
  )
}

export function Cells({ length, ...props }: Cell.Props & Cell.Length) {
  return Array.from({ length }).map((_, i) => 
    <Cell key={i} {...props} />
  )
}
