'use client'
import React, { useState, createContext, useContext, Dispatch, SetStateAction } from 'react';
import { cn, λthrow } from '@impactium/utils';
import { Anapod } from '../index';
import { Stack } from '@impactium/components';

export namespace Context {
  export interface Props extends Stack.Props {
    children: React.ReactNode
  }

  export interface Export {
    logs: Anapod.Log[],
    setLogs: React.Dispatch<React.SetStateAction<Anapod.Log[]>>,
    updateOverall: () => Promise<Anapod.Overall[]>;
    overall: Anapod.Overall[];
    focus: string | null,
    setFocus: Dispatch<SetStateAction<string | null>>;
  }

  class UnexpectedUsageException extends Error {
    constructor() {
      super('Unexpected usage of anapod. Try to add <AnapodContext /> in your page.');
    }
  }

  const context = createContext<Context.Export | undefined>(undefined);

  export const use = () => useContext(context) ?? λthrow(UnexpectedUsageException);

  export function Provider({ children, ...external_props }: Context.Props) {
    const [logs, setLogs] = useState<Anapod.Log[]>([]);
    const [overall, setOverall] = useState<Anapod.Overall[]>([]);
    const [focus, setFocus] = useState<string | null>(null);

    const updateOverall = async () => {
      const init = Date.now();

      const overall = await Anapod.Services();

      overall.push({
        name: '@impactium/anapod',
        ping: Date.now() - init - (overall.map(o => o.ping).sort((a, b) => a - b).pop() ?? 0),
        url: Anapod.Internal.url + '/services'
      })

      setOverall(overall.sort((a, b) => b.name.localeCompare(a.name)));

      return overall;
    }

    const props: Context.Export = {
      logs,
      setLogs,
      updateOverall,
      overall,
      focus,
      setFocus
    }

    return (
      <context.Provider value={props}>
        <Stack {...external_props}>
          {children}
        </Stack>
      </context.Provider>
    );
  };
}
