import { Login } from "./Login";
import { Team } from "./Team";

export type User<T = {}> = {
  uid: string,
  register: string,
  email?: string,
  username: string,
  avatar: string | null,
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
} | Logins;

export class UserEntity<T extends UserAddons = {}> implements User {
  uid: string;
  register: string;
  email?: string;
  username: string;
  balance: number;
  login: Login;
  teams?: false | Team[] | undefined;
  verified: boolean;
  logins?: Login[]
  // privates
  private _avatar: string | null;
  private _displayName: string;

  constructor(user: User<T>) {
    this.uid = user.uid;
    this.register = user.register;
    this.email = user.email;
    this.username = user.username;
    this._displayName = user.displayName;
    this._avatar = user.avatar;
    this.balance = user.balance;
    this.login = user.login;
    this.logins = user.logins;
    this.teams = user.teams;
    this.verified = user.verified;
  }

  get avatar(): string | null {
    return this._avatar || this.login?.avatar || null;
  }

  get displayName(): string {
    return this._displayName || this.login?.displayName;
  }
}