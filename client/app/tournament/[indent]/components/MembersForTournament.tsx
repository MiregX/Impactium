'use client'
import { Panel } from '@/ui/Panel';
import s from '../Tournament.module.css'
import { useTournament } from '../context'
import { Team } from '@/dto/Team';
import { Avatar } from '@/ui/Avatar';
import { useLanguage } from '@/context/Language.context';
import React from 'react';

export function MembersForTournament() {
  const { tournament } = useTournament();
  const { lang } = useLanguage();

  return (
    <Panel className={s.members} heading={lang.tournament.members}>
      <React.Fragment>
        {tournament.teams.map((team: Team, index: number) => (
          <Avatar key={index} size={32} src={team.logo} alt={team.indent} />
        ))}
      </React.Fragment>
    </Panel>
  )
}
