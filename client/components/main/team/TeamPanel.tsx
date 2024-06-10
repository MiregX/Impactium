import { Member } from './Member'
import { List } from './List'
import React from 'react';
import { BadgeType } from '@/ui/Badge';

interface Role {
  icon: string;
  lang: string;
  color: string;
}

type TeamMemberRole = BadgeType | Role

export interface TeamMember {
  name: string;
  avatar: string;
  keyrole: Role;
  roles: TeamMemberRole[]
}

export function TeamPanel() {

  const members: TeamMember[] = [
    {
      name: 'Герасимчук Марк',
      avatar: 'https://avatars.githubusercontent.com/u/57992178?v=4',
      keyrole: {
        icon: 'https://cdn.impactium.fun/custom-ui/tip.svg',
        lang: 'mireg_sto',
        color: '#ffff00'
      },
      roles: [
        {
          icon: 'https://cdn.impactium.fun/custom-ui/tip.svg',
          lang: 'mireg_sto',
          color: '#ffff00'
        },
        BadgeType.frontend
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