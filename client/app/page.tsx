import React from 'react';
import { TournamentsList } from '@/components/TournamentsList';
import { Tournament } from '@/dto/Tournament';

export default async function Main() {
  const tournaments = await api<Tournament[]>('/tournament/get');

  return (
    <React.Fragment>
      <TournamentsList tournaments={tournaments || []} />
    </React.Fragment>
  );
};
