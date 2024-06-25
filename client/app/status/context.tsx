'use client'
import { useState, createContext, useContext } from "react";
import { Status } from "@/dto/Status";

const StatusContext = createContext(undefined);

interface StatusContext {
  status: Status,
}

export const useStatus = () => useContext(StatusContext) || (() => {throw new Error()})();

export const StatusProvider = ({
    children,
    prefetched
  }) => {
  const [status, setStatus] = useState(prefetched);

  return (
    <StatusContext.Provider value={{
      status,
      setStatus,
    } as StatusContext}>
      {children}
    </StatusContext.Provider>
  );
};