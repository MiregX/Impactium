import { Team } from "./Team";

export class EditTeamRequest {
  public static create = ({ indent, title, logo, joinable, rawLogo }: Partial<Team> & { rawLogo?: File}) => {
    const form = new FormData();
    indent && form.append('indent', indent);
    title && form.append('title', title);
    joinable && form.append('joinable', joinable);
    rawLogo && form.append('logo', rawLogo);
    return form
  }
}