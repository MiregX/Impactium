'use client'
import React, { useState, createContext, useContext } from "react";
import { Team } from "@/dto/Team";
import { Children } from "@/dto/Children";

const TeamsContext = createContext<TeamsContext | undefined>(undefined);

interface TeamsContext {
  teams: Team[],
  setTeams: (teams: Team[]) => void
}

type TeamsProps = Children & {
  prefetched: Team[]
}

export const useTeams = () => useContext(TeamsContext) || (() => {throw new Error()})();

export function TeamsProvider({ children, prefetched }: TeamsProps) {
  const [teams, setTeams] = useState(prefetched || []);

  return (
    <TeamsContext.Provider value={{
      teams,
      setTeams,
    } as TeamsContext}>
      {children}
    </TeamsContext.Provider>
  );
};