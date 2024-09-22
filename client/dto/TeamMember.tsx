import { Role } from './Role'
import { UserEntity } from "./User"

export interface TeamMember {
  id: string
  uid: string
  tid: string
  role: Role | null;
  user: UserEntity
}

export const TeamMemberSetRoleRequest = (id: TeamMember['id'], role: Role | null) => JSON.stringify({ id, role })