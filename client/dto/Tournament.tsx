import { Team } from "./Team";
import { User } from "./User";

export interface Tournament {
  id: string,
  banner: string,
  title: string,
  start: Date,
  end: Date,
  description: string,
  code: string,
  rules: JSON,
  ownerId: string,
  owner: User,
  teams: Team[],
  gid: string,
  grid: any, //Grid | 
  comments: Comment[],
}

// id          String      @id @default(cuid())
// banner      String
// title       String
// start       DateTime
// end         DateTime
// description Json
// code        String      @unique
// rules       Json
// ownerId     String
// owner       User        @relation(fields: [ownerId], references: [uid])
// teams       Team[]
// gid         String
// grid        Grid?
// comments    Comment[]