'use client'
import Cookies from "universal-cookie";
import { useState, useEffect, createContext, useContext } from "react";
import { TeamEntity } from '@api/main/team/team.entity'
import { _server } from "@/dto/master";

const TeamContext = createContext(undefined);

interface TeamContext {
  team: TeamEntity;
  setTeam: (team: TeamEntity) => void;
  refreshTeam: (indent?: string) => void;
}

export const useUser = () => {
  const context = useContext(TeamContext);

  if (!context) throw new Error();
  
  return context;
};

export const TeamProvider = ({
    children,
    prefetched
  }) => {
  const [team, setTeam] = useState<TeamEntity | null>(prefetched);

  const getTeam = async (indent?: string): Promise<TeamEntity> => {
    const res = await fetch(`${_server()}/api/team/get/${indent || team.indent}`, {
      method: 'GET',
      credentials: 'include'
    });

    return res.ok ? await res.json() : undefined;
  };

  const refreshTeam = (indent?: string) => {
    getTeam(indent).then(user => {
      setTeam(user);
    });
  };

  const props: TeamContext = {
    team,
    setTeam,
    refreshTeam
  };
  return (
    <TeamContext.Provider value={props}>
      {children}
    </TeamContext.Provider>
  );
};