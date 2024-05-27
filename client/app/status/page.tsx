'use client'
import { PanelTemplate } from "@/components/main/PanelTempate";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { _server } from "@/dto/master";
import { Unit } from "./components/Unit";
import { Status } from "@/dto/Status";
import { Panel } from "@/ui/Panel";
import { useLanguage } from "@/context/Language";
import s from './Status.module.css'

const StatusContext = createContext(undefined);

export const useStatus = () => {
  return useContext(StatusContext) as {
    status: Status
  };
};

export default function StatusPage({ status }: {
  status: Status
}) {
  const { lang } = useLanguage();
  return (
    <PanelTemplate style={[s.panel]}>
      <StatusContext.Provider value={{ status }}>
        <Panel heading={lang.status.heading}>
          <React.Fragment>
            <Unit name='redis' />
            <Unit name='telegram' />
            <Unit name='cockroachdb' />
            {/* <Unit name='cdn' />
            <Unit name='api' />
            <Unit name='client' />
            <Unit name='mcs' />
            <Unit name='pterodactyl' /> */}
          </React.Fragment>
        </Panel>
      </StatusContext.Provider>
    </PanelTemplate>
  )
}
