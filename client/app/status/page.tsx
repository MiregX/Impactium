'use client'
import { PanelTemplate } from "@/components/PanelTempate";
import React from 'react';
import { Unit } from "./components/Unit";
import { Panel } from "@/ui/Panel";
import { useLanguage } from "@/context/Language.context";
import s from './Status.module.css'

export default function StatusPage() {
  const { lang } = useLanguage();

  return (
    <PanelTemplate className={s.panel}>
        <Panel heading={lang.status.heading}>
          <React.Fragment>
            <Unit name='redis' />
            <Unit name='telegram' />
            <Unit name='cockroachdb' />
          </React.Fragment>
        </Panel>
    </PanelTemplate>
  )
}
