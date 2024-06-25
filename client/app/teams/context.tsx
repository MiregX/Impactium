'use client'
import { useState, createContext, useContext } from "react";
import { Team } from "@/dto/Team";

const TeamsContext = createContext(undefined);

interface TeamsContext {
  teams: Team[],
}

export const useTeams = () => useContext(TeamsContext) || (() => {throw new Error()})();

export const TeamsProvider = ({
    children,
    prefetched
  }) => {
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