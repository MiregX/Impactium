'use client'
import { Text } from '@/components/Text';
import { Onboarding } from '@/components/Onboarding';
import React from 'react';
import { TournamentsList } from '@/components/TournamentsList';

export default function Main() {
  return (
    <React.Fragment>
      <TournamentsList />
    </React.Fragment>
  );
};
