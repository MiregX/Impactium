import { $Enums, Team } from "@prisma/client";

export class TeamEntity implements Team {
  logo: string;
  membersAmount: number;
  indent: string;
  title: string;
  ownerId: string;

  static getLogoPath(filename: string, mimetype: string) {
    const ftp = `cdn.impactium.fun/public/uploads/${filename}.${mimetype}`
    return {
      ftp,
      cdn: 'https://' + ftp
    }
  }
}