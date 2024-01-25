export default class User {
  constructor(token) {
    this.token = token;
    this.isFetched = false;
  }

  async fetch(token = this.token) {
    const Database = await getDatabase("users");
    const userDatabase = await Database.findOne({ token });

    if (userDatabase) {
      this.isFetched = true;
      const user = Object.assign(userDatabase, userDatabase[userDatabase.lastLogin]);
      const { token, secure, discord, google, ...rest } = user;
      Object.assign(this, rest);
      this.referal = new Referal(this._id);
      await this.referal.fetch();
    }
  }

  send() {
    const user = {}
    const { token, secure, discord, google, isFetched, ...rest } = this;
    Object.assign(user, rest);
    return user
  }

  async save() {
    const Users = await getDatabase("users");
    const user = await Users.findOne({ _id: this._id });

    if (user && this.isFetched || this._id) {
      delete this.isFetched
      delete this.private
      delete this.referal
      await Users.updateOne({ _id: this._id }, { $set: this });
      this.isFetched = true;
    }
  }
}