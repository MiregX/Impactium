import { MongoDB } from "../../ulits/MongoDB.js";
import { Referal } from "./Referal.js";

export class User  {
  constructor(token) {
    this.token = token;
    this.referal = new Referal();
    this.isFetched = false;
  }

  async fetch() {
    const Database = await new MongoDB().getDatabase('users');
    const userDatabase = await Database.findOne({ token: this.token });

    if (userDatabase) {
      this.isFetched = true;
      const user = Object.assign({}, userDatabase[userDatabase.lastLogin]);
      const { token, discord, google, ...rest } = user;
      Object.assign(this, rest);
      await this.referal.fetch(this._id);
    }
  }

  send() {
    const user = {};
    const { token, discord, google, isFetched, ...rest } = this;
    Object.assign(user, rest);
    return user;
  }

  async save() {
    const Users = await new MongoDB().getDatabase("users");
    const user = await Users.findOne({ _id: this._id });

    if (user && (this.isFetched || this._id)) {
      delete this.isFetched;
      delete this.referal;
      await Users.updateOne({ _id: this._id }, { $set: this });
      this.isFetched = true;
    }
  }
}
