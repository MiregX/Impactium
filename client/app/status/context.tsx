'use client'
import { useState, createContext, useContext } from "react";
import { Status } from "@/dto/Status";
import { ReactNode } from "@/dto/ReactNode";

const StatusContext = createContext<StatusContext | undefined>(undefined)!;

interface StatusContext {
  status: Status[],
  setStatus: (status: Status[]) => void
}

export const useStatus = (): StatusContext => useContext(StatusContext)!;

export function StatusProvider({ children, prefetched }: ReactNode & { prefetched: Status[] }) {
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