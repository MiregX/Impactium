export enum TeamMemberMainRoles {
  carry,
  mid,
  offlane,
  semisupport,
  fullsupport
}

export const TeamMemberMainRolesMap = {
  [TeamMemberMainRoles.carry]: 'carry',
  [TeamMemberMainRoles.mid]: 'mid',
  [TeamMemberMainRoles.offlane]: 'offlane',
  [TeamMemberMainRoles.semisupport]: 'semisupport',
  [TeamMemberMainRoles.fullsupport]: 'fullsupport'
}

export enum TeamMemberRoles {
  owner,
  carry,
  mid,
  offlane,
  semisupport,
  fullsupport,
  rotation,
  coach
}

export const TeamMemberRolesMap = {
  [TeamMemberRoles.owner]: 'owner',
  [TeamMemberRoles.carry]: 'carry',
  [TeamMemberRoles.mid]: 'mid',
  [TeamMemberRoles.offlane]: 'offlane',
  [TeamMemberRoles.semisupport]: 'semisupport',
  [TeamMemberRoles.fullsupport]: 'fullsupport',
  [TeamMemberRoles.rotation]: 'rotation',
  [TeamMemberRoles.coach]: 'coach',
}


// owner
// carry
// mid
// offlane
// semisupport
// fullsupport
// rotation
// coach