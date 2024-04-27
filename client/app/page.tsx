'use client'
import { PanelTemplate } from '@/components/main/PanelTempate';
import { TeamPanel } from '@/components/main/team/TeamPanel';
import React from 'react';

export default function Main() {
 
  return (
    <React.Fragment>
      <PanelTemplate>
        <TeamPanel />
      </PanelTemplate>
    </React.Fragment>
  );
};
