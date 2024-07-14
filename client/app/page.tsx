import React from 'react';
import { TournamentsList } from '@/components/TournamentsList';
import { Tournament } from '@/dto/Tournament';

export default async function Main() {
  const tournaments = await api<Tournament[]>('/tournament/get', {
    next: {
      revalidate: 180
    }
  });
  return (
    <React.Fragment>
      <TournamentsList tournaments={tournaments || []} />
    </React.Fragment>
  );
};
