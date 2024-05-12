import { $Enums, Team } from "@prisma/client";

export class TeamEntity implements Team {
  logo: string;
  membersAmount: number;
  indent: string;
  title: string;
  ownerId: string;

  static getLogoPath(filename: string) {
    const ftp = `/public/uploads/${filename}`
    return {
      ftp,
      cdn: 'https://cdn.impactium.fun' + ftp
    }
  }
}