import { Login } from "./Login";
import { Team } from "./Team.dto";

export type User = {
  uid: string,
  register: string,
  email?: string,
  username: string,
  avatar: string | null,
  displayName: string,
  balance: number,
  login: Login
  teams?: Team[],
  logins?: Login[],
  verified: boolean
};

export class UserEntity implements User {
  uid: string;
  register: string;
  email?: string;
  balance: number;
  login: Login;
  teams?: Team[] | undefined;
  verified: boolean;
  logins?: Login[]
  // privates
  private _avatar: string | null;
  private _displayName: string;
  private _username: string;
  

  constructor(user: User) {
    this.uid = user.uid;
    this.register = user.register;
    this.email = user.email;
    this._username = user.username;
    this._displayName = user.displayName;
    this._avatar = user.avatar;
    this.balance = user.balance;
    this.login = user.login || (user.logins ? user.logins[0] : null);
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

  get username(): string {
    return this._username || this.login.id;
  }

  public static normalize = (user: UserEntity) => ({
    ...user,
    avatar: user._avatar,
    displayName: user._displayName,
    username: user._username
  })
}