import { Stack } from "@impactium/components";
import s from './styles/DetailedPathInformation.module.css';
import { HTMLAttributes } from "react";
import { Icon } from "@impactium/icons";

export namespace DetailedPathInformation {
  export interface Props extends Stack.Props {
    data: any;
  }
}

export function DetailedPathInformation({ data, ...props }: DetailedPathInformation.Props) {
  return (
    <Stack dir='column' className={s.detailed} {...props}>
      <h4>{data.path}</h4>
      <p>Total requests: {data.count}</p>
      <p><Icon name='Gauge' fromGeist />: {data.average}</p>
    </Stack>
  )
}