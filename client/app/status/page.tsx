'use client'
import { PanelTemplate } from "@/components/PanelTempate";
import React from 'react';
import { Unit } from "./components/Unit";
import { Panel } from "@/ui/Panel";
import { useLanguage } from "@/context/Language";
import s from './Status.module.css'

export default function StatusPage() {
  const { lang } = useLanguage();

  return (
    <PanelTemplate style={[s.panel]}>
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
