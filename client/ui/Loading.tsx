'use client'
import { useLanguage } from "@/context/Language.context"
import { Icon } from "@impactium/icons";
import { ButtonProps } from "./Button";
import React from "react";

interface LoadingProps {
  variant: Icon.Variant,
  size: ButtonProps['size']
}

export function Loading({ variant, size }: LoadingProps) {
  const { lang } = useLanguage();
  return (
    <React.Fragment>
      <Icon variant={variant} name='LoaderCircle' />
      {size !== 'icon' && lang._please_wait}
    </React.Fragment>
  )
}