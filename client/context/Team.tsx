'use client'
import { useState, useEffect, createContext, useContext } from "react";
import { Team } from "@/dto/Team";
import s from '@/app/team/[indent]/Team.module.css'

interface TeamContext {
  team: Team;
  setTeam: (team: Team) => void;
  refreshTeam: (indent?: string) => void;
}

const TeamContext = createContext<TeamContext | undefined>(undefined);

export const useLogo = ({ logo, title }: Partial<Team>) => {
  return logo
    ? <img src={logo} />
    : <span className={s.round}>{title?.slice(0, 1) || '?'}</span>
}

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
    return api(`/team/get/${indent || (team.indent)}`);
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