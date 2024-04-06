import { $Enums, Login } from "@prisma/client";

interface LoginEntityInput extends Login {

}

export class LoginEntity implements LoginEntityInput {
  uid: string;
  id: string;
  type: $Enums.LoginType;
  avatar: string;
  displayName: string;
  locale: string;
}
