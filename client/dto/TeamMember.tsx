import { Role } from './Role'
import { UserEntity } from "./User"

export interface TeamMember {
  id: string
  uid: string
  indent: string
  role: Role | null;
  user: UserEntity
}
