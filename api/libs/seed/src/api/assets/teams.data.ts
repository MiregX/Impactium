import { Joinable } from "@prisma/client";

export const teams = [
  {
    title: 'Feeder Dream Team',
    indent: 'feeders',
    description: 'Залетаем на рофлотурики. От 5к птс',
    ownerId: 'system',
    joinable: Joinable.Free
  },
  {
    title: 'Champion Squad',
    indent: 'champions',
    description: 'Команда чемпионов. От 7к птс',
    ownerId: '6',
    joinable: Joinable.Free
  }
];
