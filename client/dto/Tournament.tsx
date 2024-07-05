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
  live?: string,
  prize: number
}
