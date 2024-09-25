'use client'
import { useLanguage } from "@/context/Language.context"
import { Icon, IconProps } from "./Icon";

interface LoadingProps {
  variant: IconProps['variant']
}

export function Loading({ variant }: LoadingProps) {
  const { lang } = useLanguage();
  return (
    <>
      <Icon variant={variant} name='LoaderCircle' />
      {lang._please_wait}
    </>
  )
}