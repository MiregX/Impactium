import { $Enums, Login } from "@prisma/client";

interface LoginEntityInput extends Login {

}

export class LoginEntity implements LoginEntityInput {
  id: string;
  uid: string;
  type: $Enums.LoginType;
  avatar: string;
  displayName: string;
  on: Date;
}
