import { Role } from './Role'
import { UserEntity } from "./User.dto"

export interface TeamMember {
  id: string
  uid: string
  indent: string
  role: Role | null;
  user: UserEntity
}
