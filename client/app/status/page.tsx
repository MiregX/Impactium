'use client'
import { PanelTemplate } from "@/components/PanelTempate";
import React from 'react';
import { Unit } from "./components/Unit";
import { Panel } from "@/ui/Panel";
import { useLanguage } from "@/context/Language.context";
import s from './Status.module.css'
import { ServiceList } from "./context";

export default function StatusPage() {
  const { lang } = useLanguage();

  return (
    <PanelTemplate className={s.panel}>
        <Panel heading={lang.status.heading}>
          <React.Fragment>
            <Unit name={ServiceList.redis} />
            <Unit name={ServiceList.cockroachdb} />
          </React.Fragment>
        </Panel>
    </PanelTemplate>
  )
}
