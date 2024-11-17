import React from 'react';
import { TournamentsList } from '@/app/_components/TournamentsList';
import { Tournament } from '@/dto/Tournament';
import { Icon } from '@impactium/icons';

export default async function Main() {
  const tournaments = await api<Tournament[]>('/tournament/get') || [];

  return (
    <React.Fragment>
      <TournamentsList tournaments={tournaments} />
    </React.Fragment>
  );
};
