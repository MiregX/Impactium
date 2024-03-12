import mongodb from 'mongodb';
import { MongoDB } from '../../ulits/MongoDB.js';
import Jimp from 'jimp';
import { Achievements } from './Achievements.js';
import { Referal } from './Referal.js';

export class Player {
  constructor() {
    this.isFetched = false;
  }

  get Achievements() {
    return this.achievements;
  }

  async fetch(id = this.id) {
    console.log(id);
    const Players = await new MongoDB().getDatabase('players');
    const player = await Players.findOne({ id });

    console.log({player})
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

  async setNickname({ nickname }) {
    const error = this.validateNickname({ nickname });
    if (error) return error;

    const Players = await new MongoDB().getDatabase('players');
    const possiblePlayerWithSameNickname = await Players.findOne({
      nickname: new RegExp('^' + nickname + '$', 'i')
    });    

    if (possiblePlayerWithSameNickname) return 404;

    if (this.nickname) {
      const toPushObject = [this.nickname, Date.now()]
      Array.isArray(this.oldNicknames)
      ? this.oldNicknames.push(toPushObject)
      : this.oldNicknames = [toPushObject]
    }

    this.nicknameLastChangeTimestamp = Date.now()
    this.nickname = nickname;
    await this.save()
    const status = await this.initAuthMe();
    return status;
  }

  validateNickname({ nickname }) {
    if (nickname === 'undefined') return 401
    if (Date.now() - this.nicknameLastChangeTimestamp < 60 * 60 * 1000 && this.nickname) return 403;
    if (!/^[a-zA-Z0-9_]{3,32}$/.test(nickname)) return 401;
    if (this.nickname?.toLowerCase() === (nickname ?? '').toLowerCase()) return 405;
    if (typeof this.nickname !== 'undefined' && this.nickname?.toLowerCase() === this.password?.toLowerCase()) return 406;
  }

  async setSkin({ title, buffer }) {
    const image = await Jimp.read(buffer);
    const { width, height } = image.bitmap;

    if (width !== 64 || height !== 64) return 402;
    if (!this.skin) this.skin = {}

    const defaultPlayersSkinsFolderPath = "https://cdn.impactium.fun/minecraftPlayersSkins/";
    this.skin.iconLink = `${defaultPlayersSkinsFolderPath}${this.id}_icon.png`;
    this.skin.charlink = `${defaultPlayersSkinsFolderPath}${this.id}.png`;
    this.skin.originalTitle = title;
    await this.save();
    return 200
  }

  async setPassword({ password }) {
    if (this.nickname?.toLowerCase() === password.toLowerCase()) return 401;
    if (!/^[a-zA-Z0-9_]{3,32}$/.test(password)) return 402;
    if (this.password === password) return 403;

    this.password = password;
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
    
    // TODO:
    // Переписать на взаимодействие между mcs и acc 
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

  serialize() {
    const visited = new Set();
  
    function serializeObject(obj) {
      if (visited.has(obj)) {
        return {};
      }
      visited.add(obj);
  
      return Object.keys(obj).reduce((acc, key) => {
        if (key === 'id' || key === '_id') {
          acc[key] = new mongodb.ObjectId(obj[key]);
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
    const Players = await new MongoDB().getDatabase("players");
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

