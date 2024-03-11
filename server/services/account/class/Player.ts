import { Condition, ObjectId } from 'mongodb';
import { getDatabase } from './utils';
const Jimp = require('jimp');
import { Achievements } from './Achievements';
import { Referal } from './Referal';

interface IPlayer {
  achievements: any;
  skin: any;
  registered: any;
  password: any;
  nickname: any;
  _id: Condition<ObjectId>;
}

export class Player implements IPlayer {
  achievements: any;
  id: any;
  isFetched?: boolean;
  referal: any;
  nicknameLastChangeTimestamp: number;
  nickname: any;
  password: any;
  oldNicknames: any;
  skin: any;
  registered: any;
  balance: number;
  _id: Condition<ObjectId>;

  constructor(id: string) {
    this.id = id;
    this.isFetched = false;
  }

  get Achievements() {
    return this.achievements;
  }

  async fetch(id: string = this.id) {
    const Players = await getDatabase('players');
    const player = await Players.findOne({
      $or: [
        { id },
        { discordId: id },
        { nickname: { $regex: new RegExp(`^${id}$`, 'i') } }
      ]
    });

    if (player) {
      Object.assign(this, player);
      this.achievements = new Achievements(this)
      this.referal = new Referal(this.id)
      await this.referal.fetch()
      this.isFetched = true;
    } else {
      await this.save()
    }
  }

  async setNickname(newNickname) {
    if (newNickname === 'undefined') return 401
    if (Date.now() - this.nicknameLastChangeTimestamp < 60 * 60 * 1000 && this.nickname) return 403;
    if (!/^[a-zA-Z0-9_]{3,32}$/.test(newNickname)) return 401;
    if (this.nickname?.toLowerCase() === (newNickname ?? '').toLowerCase()) return 405;
    if (typeof this.nickname !== 'undefined' && this.nickname?.toLowerCase() === this.password?.toLowerCase()) return 406;

    const Players = await getDatabase("minecraftPlayers");
    const possiblePlayerWithSameNickname = await Players.findOne({
      nickname: new RegExp('^' + newNickname + '$', 'i')
    });    

    if (possiblePlayerWithSameNickname) return 404;

    if (this.nickname) {
      const toPushObject = [this.nickname, Date.now()]
      Array.isArray(this.oldNicknames)
      ? this.oldNicknames.push(toPushObject)
      : this.oldNicknames = [toPushObject]
    }

    this.nicknameLastChangeTimestamp = Date.now()
    this.nickname = newNickname;
    await this.save()
    const status = await this.initAuthMe();
    return status;
  }

  async setSkin(originalImageName, imageBuffer) {
    const image = await Jimp.read(imageBuffer);
    const { width, height } = image.bitmap;

    if (width !== 64 || height !== 64) return 402;
    if (!this.skin) this.skin = {}

    const defaultPlayersSkinsFolderPath = "https://cdn.impactium.fun/minecraftPlayersSkins/";
    this.skin.iconLink = `${defaultPlayersSkinsFolderPath}${this.id}_icon.png`;
    this.skin.charlink = `${defaultPlayersSkinsFolderPath}${this.id}.png`;
    this.skin.originalTitle = originalImageName;
    await this.save();
    return 200
  }

  async setPassword(newPassword) {
    if (!/^[a-zA-Z0-9_]{3,32}$/.test(newPassword)) return 402;
    if (this.nickname?.toLowerCase() === newPassword.toLowerCase()) return 401;
    if (this.password === newPassword) return 403;

    this.password = newPassword;
    await this.save();
    const status = await this.initAuthMe();
    return status;
  }

  async register() {
    if (!this.registered) {
      this.registered = Date.now(); 
      await this.save();
      return 200
    } else {
      return 403
    }
  }

  async initAuthMe() {
    // if (this.nickname && this.password) {
    //   const registered = await server.command(`authme register ${this.nickname} ${this.password}`);
    //   const changed = await server.command(`authme changepassword ${this.nickname} ${this.password}`);
    //   server.updateWhitelist();
    //   if (registered || changed) {
    //     return 200
    //   } else {
    //     return 500
    //   }
    // } else {
    //   return 200
    // }
  }

  async _balance(number, save = true) {
    if (typeof this.balance === 'undefined' || isNaN(this.balance))
      this.balance = 0;

    if (typeof number !== 'number' || number === 0)
      return;

    this.balance += number;
    if (save)
      await this.save();
  }

  serialize(): IPlayer {
    const visited = new Set();
  
    function serializeObject(obj): any {
      if (visited.has(obj)) {
        return {};
      }
      visited.add(obj);
  
      return Object.keys(obj).reduce((acc, key) => {
        if (key === 'id' || key === '_id') {
          acc[key] = new ObjectId(obj[key]);
        } else if (key === 'player') {
        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
          if (Array.isArray(obj[key])) {
            acc[key] = obj[key].map(item => serializeObject(item));
          } else {
            const nested = serializeObject(obj[key]);
            if (Object.keys(nested).length === 1 && nested[key] !== undefined) {
              acc[key] = nested[key];
            } else {
              acc[key] = nested;
            }
          }
        } else {
          acc[key] = obj[key];
        }
        return acc;
      }, {});
    }

    return serializeObject(this);
  }

  send() {
    const player = this.serialize();
    return {
      nickname: player.nickname,
      password: player.password,
      skin: player.skin,
      registered: player.registered,
      achievements: player.achievements
    };
  }
  
  async save() {
    const Players = await getDatabase("minecraftPlayers");
    const player = await Players.findOne({ _id: this._id });

    if (player || this._id) {
      delete this.isFetched
      delete this.referal
      await Players.updateOne({ _id: this._id }, { $set: this.serialize() });
      this.isFetched = true;
    } else if (this.id) {
      delete this.isFetched
      delete this.referal
      await Players.insertOne(this.serialize());
      this.isFetched = true;
    }
  }
}

