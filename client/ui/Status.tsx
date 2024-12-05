import s from './styles/Status.module.css';
import { Color } from '@impactium/design';

export namespace Status {
  export interface Props {
    value: number | string;
    color: Color
  }  
}

export function Status({ value, color }: Status.Props) {
  const borderColor = new Color(color).minus(4).valueOf();

  return (
    <span className={s.status} style={{ borderColor, color: color.valueOf() }}>
      {value}
    </span>
  )
}