import { $Enums, Team } from "@prisma/client";

export class TeamEntity implements Team {
  id: string;
  indent: string;
  banner: string;
  title: string;
  ownerId: string;
}