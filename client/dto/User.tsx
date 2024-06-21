import { Login } from "./Login";
import { Team } from "./Team";

export interface User {
  uid: string,
  register: string,
  email?: string,
  balance: number,
  login: Login
  teams?: Team[] | false,
  verified: boolean
}