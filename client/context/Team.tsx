'use client'
import { useState, useEffect, createContext, useContext } from "react";
import { _server } from "@/dto/master";

const TeamContext = createContext(undefined);

interface TeamContext {
  team: any;
  setTeam: (team: any) => void;
  refreshTeam: (indent?: string) => void;
}

export const useTeam = () => {
  const context = useContext(TeamContext);

  if (!context) throw new Error();
  
  return context as TeamContext;
};

export const TeamProvider = ({
    children,
    prefetched
  }) => {
  const [team, setTeam] = useState(prefetched);

  const getTeam = async (indent?: string): Promise<any> => {
    const res = await fetch(`${_server()}/api/team/get/${indent || (team.indent)}`, {
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