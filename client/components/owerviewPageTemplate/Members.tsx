'use client'
import { useLanguage } from "@/context/Language";
import { Panel } from "@/ui/Panel";


export function Members({ state }) {
  const { lang } = useLanguage();

  return (
    <Panel heading={lang.team.members}>
      {null}
    </Panel>
  )
}