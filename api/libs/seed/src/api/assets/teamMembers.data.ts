import { Role } from "@prisma/client";

export const members = [
  {
    uid: '1',
    indent: 'feeders',
    role: Role.Carry
  },
  {
    uid: '2',
    indent: 'feeders',
    role: Role.Offlane
  },
  {
    uid: '3',
    indent: 'feeders',
    role: Role.FullSupport
  },
  {
    uid: '4',
    indent: 'feeders',
    role: Role.Rotation
  },
  {
    uid: '5',
    indent: 'feeders',
    role: Role.Carry
  },
  {
    uid: '6',
    indent: 'champions',
    role: Role.Carry
  },
  {
    uid: '7',
    indent: 'champions',
    role: Role.Mid
  },
  {
    uid: '8',
    indent: 'champions',
    role: Role.Offlane
  },
  {
    uid: '9',
    indent: 'champions',
    role: Role.SemiSupport
  },
  {
    uid: '10',
    indent: 'champions',
    role: Role.FullSupport
  }
];
