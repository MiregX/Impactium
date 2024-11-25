import s from './styles/Dot.module.css'
import { Color, Side } from '@impactium/types';

export interface DotProps {
  side?: Side;
  point?: Color
}

export function Dot({ side, point }: DotProps) {
  if (!side)
    return null;

  const counterPadding = side === Side.TOP || side === Side.LEFT ? '0' : '-24px';

  const pos = {
    top: {
      left: '50%',
      top: counterPadding
    },
    right: {
      left: 'unset',
      top: '50%',
      right: counterPadding
    },
    bottom: {
      top: 'unset',
      left: '50%',
      bottom: counterPadding
    },
    left: {
      left: counterPadding,
      top: '50%',
    },
  }

  return (
    <span className={s.dot} style={pos[side]}>
      <hr style={{ background: point ?? 'red' }} />
    </span>
  )
}