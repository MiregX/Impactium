'use client'
import { Icon } from "@impactium/icons";
import { ButtonProps } from "../button";
import { Stack } from "../stack";
import s from './loading.module.css';
import { cn } from '@impactium/utils';

export namespace Loading {
  export interface Props extends Stack.Props {
    variant: Icon.Variant;
    size: ButtonProps['size'];
    label?: string;
  }
}

export function Loading({ variant, size, label, className, children, ...props }: Loading.Props) {
  return (
    <Stack className={cn(className, s.loading)} {...props}>
      <Icon variant={variant} name='LoaderCircle' fromGeist />
      {size !== 'icon' && <p>Please wait...</p>}
    </Stack>
  )
}