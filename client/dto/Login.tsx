import { LoginTypes } from "./LoginTypes";

export interface Login {
  uid: string,
  id: string,
  type: LoginTypes,
  on: string,
  avatar: string,
  displayName: string,
}