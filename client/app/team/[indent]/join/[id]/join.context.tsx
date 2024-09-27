'use client'
import { useState, createContext, useContext, useEffect } from "react";
import { TeamInvite, TeamInviteStatus } from "@/dto/TeamInvite.dto";
import { useTeam } from "../../team.context";

interface TeamJoinContext {
  id: string;
  valid: TeamInviteStatus | null;
}

const TeamJoinContext = createContext<TeamJoinContext | undefined>(undefined);

export const useTeamJoin = () => {
  return useContext(TeamJoinContext) || (() => { throw new Error('Обнаружена попытка использовать TeamJoinContext вне области досягаемости') })();
};

export const TeamJoinProvider = ({
    children,
    id: _id
  }: {
    children: React.ReactNode,
    id: string,
  }) => {
  const { team } = useTeam();
  const [id, setId] = useState<string>(_id);
  const [valid, setValid] = useState<TeamInviteStatus | null>(null);

  useEffect(() => {
    if (id) api<TeamInviteStatus>(`/team/${team.indent}/invite/check/${id}`, setValid);
  }, [id]);

  const props: TeamJoinContext = {
    id,
    valid
  };

  return (
    <TeamJoinContext.Provider value={props}>
      {children}
    </TeamJoinContext.Provider>
  );
};