'use client'
import { useLanguage } from "@/context/Language.context"
import { Icon } from "./Icon";

export function Loading() {
  const { lang } = useLanguage();
  return (
    <>
      <Icon name='LoaderCircle' />
      {lang._please_wait}
    </>
  )
}