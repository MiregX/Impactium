import { Stack } from '@impactium/components';
import s from './encount.module.css';

export namespace Encount {
  export interface Props extends Stack.Props {
    name: string;
    value: number;
  }
}

export function Encount({ ...props }: Encount.Props) {
  return (
    <Stack {...props}>

    </Stack>
  )
}