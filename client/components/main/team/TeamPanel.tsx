import { Member } from './Member'
import { List } from './List'
import React from 'react';
import { BadgeTypes } from '@/ui/Badge';

type TeamMemberRole = BadgeTypes | {
  icon: string;
  lang: string;
  color: string;
}

interface TeamMember {
  name: string;
  avatar: string;
  roles: TeamMemberRole[]
}

export function TeamPanel() {

  const members: TeamMember[] = [
    {
      name: 'Герасимчук Марк',
      avatar: 'https://avatars.githubusercontent.com/u/57992178?v=4',
      roles: [
        {
          icon: 'https://cdn.impactium.fun/custom-ui/tip.svg',
          lang: 'mireg_sto',
          color: '#ffff00'
        },
        BadgeTypes.frontend
      ]
    }
  ]

  return (
    <React.Fragment>
      <Member />
      <List members={members} />
    </React.Fragment>
  );
}