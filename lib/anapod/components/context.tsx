'use client'
import React, { useState, createContext, useContext, Dispatch, SetStateAction } from "react";
import { λthrow } from '@impactium/utils';
import { Anapod } from '../index';
import s from './styles/context.module.css';

export namespace Context {
  export interface Props {
    children: React.ReactNode
  }

  export interface Export {
    logs: Anapod.Log[],
    setLogs: React.Dispatch<React.SetStateAction<Anapod.Log[]>>,
    updateOverall: () => Promise<Anapod.Overall[]>;
    focus: string | null,
    setFocus: Dispatch<SetStateAction<string | null>>;
  }

  class UnexpectedUsageException extends Error{
    constructor() {
      super('Unexpected usage of anapod. Try to add <AnapodContext /> in your page.');
    }
  }

  const context = createContext<Context.Export | undefined>(undefined);

  export const use = () => useContext(context) ?? λthrow(UnexpectedUsageException);

  export function Provider({ children }: Context.Props) {
    const [logs, setLogs] = useState<Anapod.Log[]>([]);
    const [overall, setOverall] = useState<Anapod.Overall[]>([]);
    const [focus, setFocus] = useState<string | null>(null);

    const updateOverall = async () => {
      const overall = await Anapod.Services();

      setOverall(overall);

      return overall;
    }
  
    const props: Context.Export = {
      logs,
      setLogs,
      updateOverall,
      focus,
      setFocus
    }
  
    return (
      <context.Provider value={props}>
        <div className={s.page}>
          {children}
        </div>
      </context.Provider>
    );
  };
}
