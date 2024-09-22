import { Role } from "@prisma/client";

export const members = [
  {
    uid: 'system',
    tid: 'feeders',
    role: Role.Carry
  },
  {
    uid: '2',
    tid: 'feeders',
    role: Role.Offlane
  },
  {
    uid: '3',
    tid: 'feeders',
    role: Role.FullSupport
  },
  {
    uid: '4',
    tid: 'feeders',
    role: Role.Rotation
  },
  {
    uid: '5',
    tid: 'feeders',
    role: Role.Carry
  },
  {
    uid: '6',
    tid: 'champions',
    role: Role.Carry
  },
  {
    uid: '7',
    tid: 'champions',
    role: Role.Mid
  },
  {
    uid: '8',
    tid: 'champions',
    role: Role.Offlane
  },
  {
    uid: '9',
    tid: 'champions',
    role: Role.SemiSupport
  },
  {
    uid: '10',
    tid: 'champions',
    role: Role.FullSupport
  }
];
