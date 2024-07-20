'use client'
import { useLanguage } from "@/context/Language.context"

export function Loading() {
  const { lang } = useLanguage();
  return (
    <>
      <img src='https://cdn.impactium.fun/ui/action/loading.svg' />
      {lang._please_wait}
    </>
  )
}