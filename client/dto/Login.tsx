import { LoginTypes } from "./LoginTypes";

export interface Login {
  id: string;
  uid: string;
  type: LoginTypes;
  avatar: string;
  displayName: string;
  on: Date;
}
