import { Roles } from "@prisma/client";

export const members = [
  {
    uid: 'system',
    tid: 'feeders',
    roles: [Roles.carry, Roles.owner]
  },
  {
    uid: '2',
    tid: 'feeders',
    roles: [Roles.offlane]
  },
  {
    uid: '3',
    tid: 'feeders',
    roles: [Roles.fullsupport, Roles.semisupport]
  },
  {
    uid: '4',
    tid: 'feeders',
    roles: [Roles.rotation]
  },
  {
    uid: '5',
    tid: 'feeders',
    roles: [Roles.carry]
  },
  {
    uid: '6',
    tid: 'champions',
    roles: [Roles.owner, Roles.carry]
  },
  {
    uid: '7',
    tid: 'champions',
    roles: [Roles.mid, Roles.carry]
  },
  {
    uid: '8',
    tid: 'champions',
    roles: [Roles.offlane]
  },
  {
    uid: '9',
    tid: 'champions',
    roles: [Roles.semisupport, Roles.carry]
  },
  {
    uid: '10',
    tid: 'champions',
    roles: [Roles.fullsupport]
  }
];
