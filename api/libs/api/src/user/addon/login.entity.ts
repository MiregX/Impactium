import { $Enums, Login } from "@prisma/client";

export class LoginEntity implements Login {
  id: string;
  uid: string;
  type: $Enums.LoginType;
  avatar: string;
  displayName: string;
  on: Date;
}
