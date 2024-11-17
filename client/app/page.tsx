import React from 'react';
import { TournamentsList } from '@/app/_components/TournamentsList';
import { Tournament } from '@/dto/Tournament';
import { Icon } from '@impactium/icons';

export default async function Main() {
  const tournaments = await api<Tournament[]>('/tournament/get') || [];

  return (
    <React.Fragment>
      <Icon name='FunctionGo' />
      <Icon name='FunctionEdge' variant='dimmed' />
      <Icon name='FunctionNode' color='#212121' />
      <Icon name='FunctionRuby' size={32} />
      <Icon name='User' />
      <Icon name='User' variant='dimmed' />
      <Icon name='User' color='#212121' />
      <Icon name='User' size={32} />
      <Icon name='X' />
      <Icon name='X' variant='dimmed' />
      <Icon name='X' color='#212121' />
      <Icon name='X' size={32} />
      <TournamentsList tournaments={tournaments} />
    </React.Fragment>
  );
};
