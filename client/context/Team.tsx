'use client'
import { useState, useEffect, createContext, useContext } from "react";
import { _server } from "@/dto/master";
import { Team } from "@/dto/Team";
import s from '@/app/team/[indent]/Team.module.css'

const TeamContext = createContext(undefined);

interface TeamContext {
  team: Team;
  setTeam: (team: Team) => void;
  refreshTeam: (indent?: string) => void;
}

export const useLogo = ({ logo, title }: Partial<Team>) => {
  return logo
    ? <img src={logo} />
    :     <span className={s.round}>{title.slice(0, 1)}</span>
}

export const useTeam = () => {
  const context = useContext(TeamContext);

  if (!context) throw new Error();
  
  return context as TeamContext;
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
    return get(`/api/team/get/${indent || (team.indent)}`);
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