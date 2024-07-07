import { Login } from "./Login";
import { Team } from "./Team";

export type User<T = {}> = {
  uid: string,
  register: string,
  email?: string,
  username: string,
  displayName: string,
  balance: number,
  login: Login
  teams?: Team[] | false,
  verified: boolean
} & T;

export interface Logins {
  logins: Login[]
};

export type UserAddons = {
  [key: string]: any;
} | Logins