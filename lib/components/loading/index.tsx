'use client'
import { Icon } from "@impactium/icons";
import { ButtonProps } from "../button";
import { Stack } from "../stack";

export namespace Loading {
  export interface Props {
    variant: Icon.Variant;
    size: ButtonProps['size'];
    label?: string;
  }
}

export function Loading({ variant, size, label, ...props }: Loading.Props) {
  return (
    <Stack {...props}>
      <Icon variant={variant} name='LoaderCircle' fromGeist />
      {size !== 'icon' && 'Please wait...'}
    </Stack>
  )
}