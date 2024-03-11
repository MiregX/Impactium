import { getDatabase } from "./utils";
import { Referal } from "./Referal";
import { Condition, ObjectId } from "mongodb";

interface Account {
  id: string,
  email: string,
  avatar: string,
  displayName: string,
  locale: string
}

type DiscordAccount = Account;
type GoogleAccount = Account;

interface IUser {
  _id: any;
  lastLogin: 'google' | 'discord',
  token: string;
  isFetched?: boolean;
  discord?: DiscordAccount;
  google?: GoogleAccount;
  referal?: Referal;
  isVerified?: boolean,
  isCreator?: boolean,
  balance: number,
}

export class User implements IUser {
  _id: Condition<ObjectId> | undefined;
  token: string;
  isFetched?: boolean;
  referal?: Referal;
  lastLogin: "google" | "discord";
  discord?: Account | undefined;
  google?: Account | undefined;
  isVerified?: boolean | undefined;
  isCreator?: boolean | undefined;
  balance: number;

  constructor(token: string) {
    this.token = token;
    this.isFetched = false;
  }

  async fetch() {
    const Database = await getDatabase('users');
    const userDatabase = await Database.findOne({ token: this.token });

    if (userDatabase) {
      this.isFetched = true;
      const user = Object.assign({}, userDatabase[userDatabase.lastLogin]);
      const { token, discord, google, ...rest } = user;
      Object.assign(this, rest);
      this.referal = new Referal(this._id);
      await this.referal.fetch();
    }
  }

  send(): IUser {
    const user: any = {};
    const { token, discord, google, isFetched, ...rest } = this;
    Object.assign(user, rest);
    return user;
  }

  async save() {
    const Users = await getDatabase("users");
    const user = await Users.findOne({ _id: this._id });

    if (user && (this.isFetched || this._id)) {
      delete this.isFetched;
      delete this.referal;
      await Users.updateOne({ _id: this._id }, { $set: this });
      this.isFetched = true;
    }
  }
}
