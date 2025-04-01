'use client'
import { Icon } from '@impactium/icons';
import { Button } from '../button';
import { Stack } from '../stack';
import s from './loading.module.css';

export namespace Loading {
  export interface Props extends Stack.Props {
    variant: Icon.Variant;
    size: Button.Props['size'];
    label?: string;
  }
}

export function Loading({ variant, size, label = 'Please wait...', className, children, ...props }: Loading.Props) {
  return (
    <>
      <Icon className={s.icon} variant={variant} name='LoaderCircle' fromGeist />
      {size !== 'icon' && label}
    </>
  )
}