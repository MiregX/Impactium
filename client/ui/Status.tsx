import { cn } from '@/lib/utils';
import { DesignSystem, Utils } from '@impactium/utils';
import s from './styles/Status.module.css';

export namespace Status {
  export interface Props {
    value: number | string;
    color: DesignSystem.Color
  }  
}

export function Status({ value, color }: Status.Props) {
  const borderColor = new DesignSystem.Color(color).minus(4).valueOf();

  return (
    <span className={s.status} style={{ borderColor, color: color.valueOf() }}>
      {value}
    </span>
  )
}