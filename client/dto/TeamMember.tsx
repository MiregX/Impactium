import { TeamMemberRoles } from "./TeamMemberRoles"
import { User, UserEntity } from "./User"

export interface TeamMember {
  id: string
  uid: string
  tid: string
  roles: string[]
  user: UserEntity
}


// model TeamMembers {
//   id            String        @id @default(cuid())
//   uid           String
//   user          User          @relation(fields: [uid], references: [uid])
//   tid           String
//   team          Team          @relation(fields: [tid], references: [indent])
//   roles         Roles[]
// }