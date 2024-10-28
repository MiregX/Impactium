'use client'
import { useState, createContext, useContext } from "react";
import { Children } from "@/types";

export enum ServiceList {
  redis = 'redis',
  cockroachdb = 'cockroachdb',
  telegram = 'telegram'
}

export type Status = {
  [key in ServiceList]: {
    ping: number;
    info: Record<string, any>;
  }
}

const StatusContext = createContext<StatusContext | undefined>(undefined)!;

interface StatusContext {
  status: Status[],
  setStatus: (status: Status[]) => void
}

export const useStatus = (): StatusContext => useContext(StatusContext)!;

export function StatusProvider({ children, prefetched }: Children & { prefetched: Status[] }) {
  const [status, setStatus] = useState(prefetched);

  return (
    <StatusContext.Provider value={{
      status,
      setStatus,
    }}>
      {children}
    </StatusContext.Provider>
  );
};