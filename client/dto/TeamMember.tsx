import { Roles } from "./Roles"
import { UserEntity } from "./User"

export interface TeamMember {
  id: string
  uid: string
  tid: string
  roles: Roles[]
  user: UserEntity
}
