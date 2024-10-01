'use client'
import { useState, useEffect, createContext, useContext } from "react";
import { Team } from "@/dto/Team.dto";

interface TeamContext {
  team: Team;
  setTeam: React.Dispatch<React.SetStateAction<Team>>;
  refreshTeam: (indent?: string) => void;
  leave: () => void;
  join: () => void;
}

const TeamContext = createContext<TeamContext | undefined>(undefined);

export const useTeam = () => {
  return useContext(TeamContext) || (() => { throw new Error('Обнаружена попытка использовать TeamContext вне области досягаемости') })();
};

export const TeamProvider = ({
    children,
    prefetched
  }: {
    children: React.ReactNode,
    prefetched: Team
  }) => {
  const [team, setTeam] = useState(prefetched);

  const getTeam = (indent?: string): Promise<any> => {
    return api(`/team/${indent || team.indent}/get`);
  };
  
  const leave = () => api<Team>(`/team/${team.indent}/leave`, {
    method: 'DELETE',
  }, team => setTeam(team));

  const refreshTeam = (indent?: string) => {
    getTeam(indent).then(user => {
      setTeam(user);
    });
  };

  const join = () => api<Team>(`/team/${team.indent}/join`, {
    method: 'POST'
  }, team => setTeam(team));

  const props: TeamContext = {
    team,
    leave,
    join,
    setTeam,
    refreshTeam
  };
  return (
    <TeamContext.Provider value={props}>
      {children}
    </TeamContext.Provider>
  );
};