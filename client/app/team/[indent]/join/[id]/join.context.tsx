'use client'
import { useState, createContext, useContext, useEffect } from "react";
import { useTeam } from "../../team.context";
import { λError } from "@impactium/pattern";
import { TeamInvite } from "@/dto/TeamInvite.dto";

interface TeamJoinContext {
  id: string;
  valid: TeamInvite | TeamInviteError | null;
}

const TeamJoinContext = createContext<TeamJoinContext | undefined>(undefined);

export const useTeamJoin = () => {
  return useContext(TeamJoinContext) || (() => { throw new Error('Обнаружена попытка использовать TeamJoinContext вне области досягаемости') })();
};

export type TeamInviteError = λError.team_invite_expired | λError.team_invite_not_found | λError.team_invite_used;

export type TeamInviteResponse = {
  message: TeamInviteError;
} | TeamInvite

export const TeamJoinProvider = ({
    children,
    id: _id
  }: {
    children: React.ReactNode,
    id: string,
  }) => {
  const { team } = useTeam();
  const [id, setId] = useState<string>(_id);
  const [valid, setValid] = useState<TeamInvite | TeamInviteError | null>(null);

  useEffect(() => {
    if (id) api<TeamInviteResponse>(`/team/${team.indent}/invite/check/${id}`,{
      raw: true
    }).then(response => setValid(response.isError() ? response.data?.message as TeamInviteError : response.data as TeamInvite));
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