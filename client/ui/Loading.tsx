'use client'
import { useLanguage } from "@/context/Language.context"

export function Loading() {
  const { lang } = useLanguage();
  return (
    <>
      <img src='' />
      {lang._please_wait}
    </>
  )
}