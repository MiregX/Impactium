const fs = require('fs');
const ftp = require('ftp');
const Jimp = require('jimp');
const path = require('path');
const axios = require('axios');
const crypto = require('crypto');
const archiver = require('archiver');
const { v4: uuidv4 } = require('uuid');
const { ObjectId } = require('mongodb');
const { Telegraf, Markup } = require('telegraf');
const { spawn } = require('child_process');
const Dropbox = require('dropbox').Dropbox;
const { pterosocket } = require('pterosocket')
const SftpClient = require('ssh2-sftp-client');
const { MongoClient, ServerApiVersion } = require('mongodb');
const { mongoLogin, sftpConfig, minecraftServerAPI, ftpConfig, telegramBotToken } = process.env;

class User {
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
      this.private = userDatabase;
      this.referal = new Referal(this._id);
      await this.referal.fetch();
      Object.assign(this, rest);
    }
  }

  setGuild(guildKey) {
    if (this.lastLogin !== "discord") return
    this.guild = this.guilds.find(guild =>
      guild.name.toLowerCase() === guildKey.toLowerCase() || 
      guild.id.toLowerCase() === guildKey.toLowerCase())
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

class Referal {
  constructor(key) {
    this.code = key._id
      ? key._id
      : key
  }

  async fetch(key = this.code) {
    this.code = key._id
    ? key._id
    : key
    const Referals = await getDatabase('referals');
    const referal = await Referals.findOne({
      $or: [
        { id: this.code },
        { code: this.code }
      ]
    });

    if (referal) {
      Object.assign(this, referal);
    } else {
      await this.create();
    }
  }

  async create() {
    if (this.code.length <= 8 || this._id)
      return

    Object.assign(this, {
      id: this.code,
      code: await this.newCode(),
      parent: null,
      childrens: [],
      isAllChildrensConfirmed: true
    });
    
    const Referals = await getDatabase('referals');
    await Referals.insertOne(this);
    await this.fetch()
  }

  async newCode() {
    const code = generateToken(4);
    const Referals = await getDatabase('referals');
    const referal = await Referals.findOne({ code });
    if (referal) {
      return await this.newCode();
    }
    return code;
  }

  async setParent(parent) {
    if (this.parent)
      return;

    this.parent = parent
    this.save();
  }

  async newChildren(childrenId) {
    const isExist = this.childrens.find(children => children.id === childrenId);
    if (!childrenId || isExist)
      return;

    this.childrens.push({
      id: childrenId,
      registered: Date.now(),
      isConfirmed: false
    });

    this.isAllChildrensConfirmed = false;

    await this.save();
    // const parent = new MinecraftPlayer(this.id);
    // await parent.fetch();
    // parent.achievements.getEvent(this.childrens.length);
  }

  async save() {
    const Referals = await getDatabase('referals');
    const referal = await Referals.findOne({ _id: this._id });

    if (referal) {
      await Referals.updateOne({ _id: this._id }, { $set: this });
    }
  }
}

class Guild {
  constructor() {
    this.name = false;
    this.isFetched = false;
  }

  async fetch(guildKey) {
    const Guilds = await getDatabase("guilds");
    const guild = await Guilds.findOne({
      $or: [
        { name: { $regex: `^${guildKey}$`, $options: 'i' } },
        { id: guildKey },
        { hash: guildKey }
      ]
    });
    
    if (guild) {
      Object.assign(this, guild);
      this.isFetched = true;
    }
  }

  newStatsInstance() {
    return new GuildStatisticsInstance(this);
  }
  
  async save() {
    if (this.player) delete this.player
    const Guilds = await getDatabase("guilds");
    const guild = await Guilds.findOne({ _id: this._id });

    if (guild && this.isFetched || this._id) {
      delete this.isFetched
      await Guilds.updateOne({ _id: this._id }, { $set: this });
      this.isFetched = true;
    } else if (this.name && this.avatar && this.isBotAdmin) {
      await Guilds.insertOne(this);
    }
  }
}

class GuildStatisticsInstance extends Guild {
  constructor(guild = null) {
    super();

    if (guild) {
      Object.assign(this, guild);
    }
  }

  getStatisticsField() {
    const timestamp = formatDate();

    if (!this.statistics) this.statistics = {};

    const dateObj = this.statistics[timestamp.date] ?? (this.statistics[timestamp.date] = {});
    const statObj = dateObj[timestamp.hour] ?? (dateObj[timestamp.hour] = {});

    return statObj;
  }

  clearStatisticsFields() {
    const days = Object.keys(this.statistics);

    if (days.length <= 7) return;

    const keys = days.slice(0, days.length - 8);

    for (const key of keys) {
      delete this.statistics[key];
    }

    this.save();
  }

  parseStatistics(isForced = false) {
    if (!isForced && new Date() - new Date(this.parsedStatistics?.timestamp) < 60 * 60 * 1000) return this.parsedStatistics;
    if (!this.parsedStatistics) this.parsedStatistics = {};

    if (this.isFakeGuild) return this.parsedStatistics;

    const sampleField = this.statistics[Object.keys(this.statistics)[0]][Object.keys(this.statistics[Object.keys(this.statistics)[0]])[0]];

    if (typeof sampleField !== 'object' || Array.isArray(sampleField)) return;

    Object.keys(sampleField).forEach((currentField) => {
      this.parsedStatistics[currentField] = {
        labels: {},
        values: [],
      };

      Object.keys(this.statistics).forEach((date) => {
        this.parsedStatistics[currentField].labels[date] = [];
        Object.keys(this.statistics[date])
          .sort()
          .forEach((hour) => {
            const entry = this.statistics[date][hour][currentField] || 0;

            if (
              this.parsedStatistics[currentField].values.length === 0 ||
              this.parsedStatistics[currentField].values[this.parsedStatistics[currentField].values.length - 1][0] !== entry
            ) {
              this.parsedStatistics[currentField].values.push([entry, 1]);
            } else {
              this.parsedStatistics[currentField].values[this.parsedStatistics[currentField].values.length - 1][1]++;
            }

            this.parsedStatistics[currentField].labels[date].push(`${hour}`);
          });
      });

      this.parsedStatistics.timestamp = Date.now();
    });

    this.save();
    return this.parsedStatistics;
  }
}

class Schedule {
  constructor(id) {
    this.id = id;
    this.isFetched = false;
  }

  async fetch(id = this.id) {
    const Schedules = await getDatabase("schedules");
    const schedule = await Schedules.findOne({ id });

    if (schedule) {
      Object.assign(this, schedule);
      this.isFetched = true;
    } else if (this.id) {
      await Schedules.insertOne(this);
      this.isFetched = true;
    }
  }

  async save() {
    const Schedules = await getDatabase("schedules");
    const schedule = await Schedules.findOne({ _id: this._id });

    if (schedule || this._id) {
      delete this.isFetched
      await Schedules.updateOne({ _id: this._id }, { $set: this });
      this.isFetched = true;
    } else {
      delete this.isFetched
      await Schedules.insertOne(this);
      this.isFetched = true;
    }
  }
}

class MinecraftPlayer {
  constructor(id) {
    this.id = id;
    this.isFetched = false;
  }

  get Achievements() {
    return this.achievements;
  }

  async fetch(id = this.id) {
    const Players = await getDatabase("minecraftPlayers");
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
      this.isFetched = true;
    } else {
      await this.save()
    }
  }

  async setNickname(newNickname) {
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
    this.initAuthMe()
    return 200
  }

  async setSkin(originalImageName, imageBuffer) {
    const image = await Jimp.read(imageBuffer);
    const { width, height } = image.bitmap;

    if (width !== 64 || height !== 64) return 402;
    if (Date.now() - this.lastSkinChangeTimestamp < 24 * 60 * 60 * 1000) return 403;
    if (!this.skin) this.skin = {}

    const defaultPlayersSkinsFolderPath = "https://api.impactium.fun/minecraftPlayersSkins/";
    this.skin.iconLink = `${defaultPlayersSkinsFolderPath}${this.id}_icon.png`;
    this.skin.charlink = `${defaultPlayersSkinsFolderPath}${this.id}.png`;
    this.skin.originalTitle = originalImageName;
    this.lastSkinChangeTimestamp = Date.now();
    await this.save();
    return 200
  }

  async setPassword(newPassword) {
    if (!/^[a-zA-Z0-9_]{3,32}$/.test(newPassword)) return 402;
    if (this.nickname?.toLowerCase() === newPassword.toLowerCase()) return 401;
    if (this.password === newPassword) return 403;

    this.password = newPassword;
    await this.save()
    this.initAuthMe()
    return 200
  }

  async register() {
    if (!this.registered) {
      this.registered = Date.now(); 
      await this.save();
    }
  }

  initAuthMe() {
    if (this.nickname && this.password) {
      const mcs = new ImpactiumServer();
      mcs.updateWhitelist();
      mcs.command(`authme register ${this.nickname} ${this.password}`);
      mcs.command(`authme changepassword ${this.nickname} ${this.password}`);
    }
  }

  async balance(number) {
    if (typeof this.balance === 'undefined' || isNaN(this.balance))
      this.balance = 0;

    if (typeof number !== 'number' || number === 0 || !number.isInteger())
      return;

    this.balance += number;
    await this.save()
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
  
  async save() {
    const Players = await getDatabase("minecraftPlayers");
    const player = await Players.findOne({ _id: this._id });

    if (player || this._id) {
      delete this.isFetched
      await Players.updateOne({ _id: this._id }, { $set: this.serialize() });
      this.isFetched = true;
    } else if (this.id) {
      delete this.isFetched
      await Players.insertOne(this.serialize());
      this.isFetched = true;
    }
  }
}

class Achievements {
  constructor(player) {
    this.achievements = player.achievements
    if (player.achievements)
      Object.assign(this.achievements, player.achievements);
    this.player = player;
  }

  async process() {
    if (this.player.achievements?.processed && Date.now() - this.player.achievements.processed < 1000 * 60 * 10) return;
    if (!this.player.stats?.processed || Date.now() - this.player.stats?.processed > 1000 * 60 * 10) await this.fetch();
    
    this.getCasual()
    this.getKiller()
    this.getDefence()

    await this.player.save();
  }

  async fetch() {
    const mcs = new ImpactiumServer();

    const playerStatsFromServer = mcs.players.stats?.find(player => player.name.toLowerCase() === this.player.nickname?.toLowerCase())

    playerStatsFromServer
      ? this.player.stats = playerStatsFromServer.stats
      : !this.player.stats
        ? this.player.stats = {}
        : null

    this.player.stats.processed = mcs.players.lastStatsFetch
    await this.player.save()
  }

  getCasual() {    
    this.clear('casual');

    this.set({
      type: 'casual',
      stage: 'diamonds',
      score: this.select('mined', 'diamond_ore') + this.select('mined', 'deepslate_diamond_ore'),
      limit: 10
    });
    this.set({
      type: 'casual',
      stage: 'netherite',
      score: this.select('mined', 'ancient_debris'),
      limit: 4
    });
    this.set({
      type: 'casual',
      stage: 'endStone',
      score: this.select('mined', 'end_stone'),
      limit: 2048
    });
    this.set({
      type: 'casual',
      stage: 'shrieker',
      score: this.select('mined', 'sculk_shrieker'),
      limit: 16
    });
    this.set({
      type: 'casual',
      stage: 'reinforcedDeepslate',
      score: this.select('mined', 'reinforced_deepslate'),
      limit: 64
    });
  }

  getKiller() {
    this.clear('killer');

    this.set({
      type: 'killer',
      stage: 'kills',
      score: this.select('custom', 'mob_kills'),
      limit: 500
    });
    this.set({
      type: 'killer',
      stage: 'wither',
      score: this.select('killed', 'wither'),
      limit: 1
    });
    this.set({
      type: 'killer',
      stage: 'dragon',
      score: this.select('killed', 'ender_dragon'),
      limit: 1
    });
    this.set({
      type: 'killer',
      stage: 'warden',
      score: this.select('killed', 'warden'),
      limit: 1
    });
    this.set({
      type: 'killer',
      stage: 'damage',
      score: this.select('custom', 'damage_dealt'),
      limit: 1000000
    });
  }

  getDefence() {
    this.clear('defence');
    const damageTaken = this.select('custom', 'damage_taken')
    
    this.set({
      type: 'defence',
      stage: 'damageOne',
      score: damageTaken,
      limit: 100000
    });
    this.set({
      type: 'defence',
      stage: 'damageTwo',
      score: damageTaken,
      limit: 250000
    });
    this.set({
      type: 'defence',
      stage: 'damageThree',
      score: damageTaken,
      limit: 500000
    });
    this.set({
      type: 'defence',
      stage: 'damageFour',
      score: damageTaken,
      limit: 750000
    });
    this.set({
      type: 'defence',
      stage: 'damageFive',
      score: damageTaken,
      limit: 1000000
    });
  }

  async getEvent(totalReferals, confirmedReferals) {
    await this.player.balance(50 * confirmedReferals);
    this.clear('event');
    
    this.set({
      type: 'event',
      stage: 'eventOne',
      score: totalReferals,
      limit: 1
    });
    this.set({
      type: 'event',
      stage: 'eventTwo',
      score: totalReferals,
      limit: 2
    });
    this.set({
      type: 'event',
      stage: 'eventThree',
      score: totalReferals,
      limit: 3
    });
    this.set({
      type: 'event',
      stage: 'eventFour',
      score: totalReferals,
      limit: 5
    });
    this.set({
      type: 'event',
      stage: 'eventFive',
      score: totalReferals,
      limit: 10
    });
  }

  select(type, entity) {
    return this.player.stats?.[`minecraft:${type}`]?.[`minecraft:${entity}`] || 0;
  }

  clear(type) {
    this.achievements[type] = { stages: {} }
  }

  set(ach) {
    this.achievements[ach.type].stages[ach.stage] = {
      score: ach.score,
      limit: ach.limit,
      percentage: Math.min(Math.floor((ach.score / ach.limit) * 100), 100),
      isDone: ach.score >= ach.limit
    };
    
    const doneStages = Object.values(this.achievements[ach.type].stages)
    .filter(stage => stage.isDone)
    .length;

    this.achievements[ach.type].doneStages = doneStages
    this.achievements[ach.type].symbol = this.getRomanianNumber(doneStages);
    this.achievements.processed = Date.now();
  }

  getRomanianNumber(number) {
    switch (number) {
      case 0:
        return ''
      case 1:
        return 'I'
      case 2:
        return 'II'
      case 3:
        return 'III'
      case 4:
        return 'IV'
      case 5:
        return 'V'
    }
  }
}
class ImpactiumServer {
  constructor() {
    if (ImpactiumServer.instance) return ImpactiumServer.instance;
    
    this.sftp = new SFTP()

    this.path = {
      folder: {},
      file: {}
    }
    this.connect = {
      origin: "https://mgr.hosting-minecraft.pro",
      api_key: minecraftServerAPI,
      server_no: "d9aa118c"
    }
    this.players = {}

    this.resourcePack = new ResoursePackInstance(this);
    this.telegramBot = new TelegramBotHandler();
    this.referals = new ReferalFetcher();
    
    ImpactiumServer.instance = this;
  }

  launch() {
    this.server = new pterosocket(this.connect.origin, this.connect.api_key, this.connect.server_no);
    
    this.server.on("start", () => {
      log("WS Соединение с панелью управления установлено!", 'y');
      this.command('list', true);
    })
    this.server.on("console_output", (packet) => { this.output(packet.replace(/\x1b\[\d+m/g, '')) })
  }

  command(command, isQuiet = false) {
    if (!this.server) return false;
    this.server.writeCommand(command);
    if (!isQuiet) log(`[MC] -> ${command}`, 'g');
    return true;
  }

  output(message) {
    if (message.slice(0, 17).includes('WARN') || message.substring(17).startsWith('[Not Secure]'))
      return

    message = message.substring(17)

    if (message.endsWith('joined the game'))
      this.players.online++
      this.telegramBot.editMessage(this.players.online)

    if (message.endsWith('left the game'))
      this.players.online--
      this.telegramBot.editMessage(this.players.online)

    if (message.startsWith('Players:')) {
      const players = message.substring(9).split(', ').length;
      this.players.online = players + 10
      this.telegramBot.editMessage(this.players.online);
    }

    if (message.endsWith('issued server command: /x'))
      applyAchievementEffect(message.split(" ")[0])
  }

  restart() {
    if (!this.server) return false;
    this.command('title @a times 20 160 20');
    this.command('title @a subtitle {"text":"\u0421\u0435\u0440\u0432\u0435\u0440 \u0431\u0443\u0434\u0435\u0442 \u043f\u0435\u0440\u0435\u0437\u0430\u0433\u0440\u0443\u0436\u0435\u043d \u0447\u0435\u0440\u0435\u0437 1 \u043c\u0438\u043d\u0443\u0442\u0443"}');
    setTimeout(() => {
      this.command('title @a title {"text":"Restart"}');
    }, 500);
    setTimeout(() => {
      this.command('kickall');
      setTimeout(() => {
        this.command('restart');
      }, 500);
    }, 60000);
  }
  
  async getDatabasePlayers() {
    const Players = await getDatabase("minecraftPlayers");
    const distinctNicknames = await Players.find({}, { _id: 0, nickname: 1 }).toArray();
    this.players.database = distinctNicknames.map(player => player.nickname).filter(n => n);
    return this.players.database;
  }

  async getWhitelistPlayers() {
    await this.sftp.connect();
    const players = await this.sftp.read('whitelist.json');
    await this.sftp.close();
    this.players.whitelist = JSON.parse(players)
    return this.players.whitelist;
  }

  async updateWhitelist() {
    await this.getDatabasePlayers();
    await this.getWhitelistPlayers() 
    let isChanged = false;

    this.players.whitelist.forEach(player => {
      if (this.players.database.find(nickname => nickname.toLowerCase() === player.name.toLowerCase())) return 
      this.command(`whitelist remove ${player.name}`);
      isChanged = true  
    })

    this.players.database.forEach(nickname => {
      const existPlayer = this.players.whitelist.find(player => player.name.toLowerCase() === nickname.toLowerCase())
      if (existPlayer) return 
      this.command(`whitelist add ${nickname}`);
      isChanged = true
    });

    if (isChanged) this.command('whitelist reload');
  }

  async fetchStats() {
    if (this.players.lastStatsFetch && (Date.now() - this.players.lastStatsFetch) < 1000 * 60 * 10) return this.players.stats
    try {
      const players = await this.getWhitelistPlayers();
      const results = [];
  
      await this.sftp.connect()
      for (const player of players) {
        try {
          const result = await this.sftp.read(`world/stats/${player.uuid}.json`);
          const stats = JSON.parse(result).stats;
          if (!stats) continue;
          player.stats = stats;
          results.push(player);
        } catch (error) {
          continue;
        }
      }
      
      await this.sftp.close()
      this.players.stats = results;
      this.players.lastStatsFetch = Date.now(); 
      return results;
    } catch (error) { return [] }
  }

  async applyAchievementEffect(nickname) {
    const player = new MinecraftPlayer()
    await player.fetch(nickname);
    if (!player.achievements?.active)
      return
    this.command(`effect give ${player.nickname} minecraft:${player.achievements.active} infinite 1 true`)
  }
}

class ResoursePackInstance {
  constructor(ImpactiumServer) {
    this.mcs = ImpactiumServer;
    this.sftp = new SFTP()
    this.ftp = new ftp();
    this.path = {
      folder: {},
      file: {}
    }
    this.path.folder.resoursePack = path.join(__dirname, 'resourse_pack');
    this.path.file.basic = path.join(__dirname, 'static', 'defaultRPIconsSourseFile.json');
    this.path.folder.icons = path.join(__dirname, 'static', 'images', 'minecraftPlayersSkins');
    this.path.file.resoursePackDestination = path.join(__dirname, 'static', 'Impactium RP.zip');
    this.path.folder.resoursePackIcons = path.join(__dirname, 'resourse_pack', 'assets', 'minecraft', 'textures', 'font');
    this.path.file.resoursePackJson = path.join(__dirname, 'resourse_pack', 'assets', 'minecraft', 'font', 'default.json');
  }

  async process() {
    await this.putIcons();
    await this.archive();
    await this.hashsum();
    await this.upload();
    await this.updateServerProperties();
    await this.setIcons();
    
    this.mcs.restart();
  }

  async putIcons() {
    await this.mcs.getWhitelistPlayers()
    const resultedJson = purge(this.path.file.basic);

    await Promise.all(this.mcs.players.whitelist.map(async (whitelistPlayer, index) => {
      const player = new MinecraftPlayer()
      await player.fetch(whitelistPlayer.name);
      if (!(player?.skin?.iconLink)) return

      const playerName = player.nickname.toLowerCase();
      const playerCode = `\\u${(index + 5000).toString(16).padStart(4, '0')}`;
      
      try {
        await fs.promises.copyFile(
          `${this.path.folder.icons}\\${player.id}_icon.png`, 
          `${this.path.folder.resoursePackIcons}\\${playerName}.png`);
          
        resultedJson.providers.push({
          type: "bitmap",
          file: `minecraft:font/${playerName}.png`,
          ascent: 8,
          height: 8,
          chars: [JSON.parse(`"${playerCode}"`)]
        });
      } catch (error) {}
    }));
  
    fs.writeFileSync(this.path.file.resoursePackJson, JSON.stringify(resultedJson, null, 2), 'utf-8');
  }

  async setIcons() {
    const playersWithFetchedIcon = purge(this.path.file.resoursePackJson);
    playersWithFetchedIcon.providers.forEach(async (player, index) => {
      if (index < 12) return
      const playerNickname = player.file.replace(/^minecraft:font\//, '').replace(/\.png$/, '')
      this.mcs.command(`lp user ${playerNickname} meta setprefix 2 "${player.chars[0]} "`);
    });
  }

  async archive() {
    return new Promise((resolve, reject) => {
      const output = fs.createWriteStream(this.path.file.resoursePackDestination);
  
      const archive = archiver('zip', {
        zlib: { level: 9 }
      });
  
      output.on('close', function () {
        resolve();
      });
  
      archive.on('error', function (err) {
        reject(err);
      });
  
      archive.pipe(output);
  
      archive.directory(this.path.folder.resoursePack, false);
      
      archive.finalize();
    });
  }

  async hashsum() {
    return new Promise((resolve, reject) => {
      const stream = fs.createReadStream(this.path.file.resoursePackDestination);
      const hash = crypto.createHash('sha1');

      stream.on('data', (chunk) => {
        hash.update(chunk);
      });

      stream.on('end', () => {
        this.hashsum = hash.digest('hex')
        resolve(this.hashsum);
      });

      stream.on('error', (err) => {
        reject(err);
      });
    });
  }

  async upload() {
    this.ftp.on('ready', () => {
      this.ftp.put(this.path.file.resoursePackDestination, `/api.impactium.fun/htdocs/Impactium_RP.zip`, async (err) => {
        this.ftp.end();
        if (err) console.log(err);
        if (err) return await this.upload();
        return true;
      });
    });

    this.ftp.connect(JSON.parse(ftpConfig));
  }
  
  async updateServerProperties() {
    await this.sftp.connect();

    const serverProperties = await this.sftp.read('server.properties');
    const lines = serverProperties.split('\n');

    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith('resource-pack-sha1=')) {
        lines[i] = `resource-pack-sha1=${this.hashsum}`;
      }
    }

    await this.sftp.save('server.properties', lines.join('\n'));
    await this.sftp.close();
  }
}

class TelegramBotHandler {
  constructor() {
    if (TelegramBotHandler.instance) return TelegramBotHandler.instance;
    TelegramBotHandler.instance = this
    this.channelId = '-1001649611744'
    this.messageId = 676
    this.basicMessage = `Текущий онлайн на сервере`
    try {
      this.bot = new Telegraf(telegramBotToken)
      this.bot.telegram.getMe();
    } catch (error) {
      return new TelegramBotHandler();
    }
  }

  async editMessage(text) {
    try {
      await this.bot.telegram.editMessageText(
        this.channelId,
        this.messageId,
        null,
        this.basicMessage,
        Markup.inlineKeyboard([
          Markup.button.callback(`Онлайн: ${text}`, 'onlineButtonCallback'),
        ])
      );
    } catch (error) { }
  } 
}

class SFTP {
  constructor() {
    if (!SFTP.instance) {
      try {
        this.sftp = new SftpClient();
      } catch (error) {
        console.log(error);
      }
      SFTP.instance = this;
    }

    return SFTP.instance;
  }

  async connect() {
    if (!this.sftp.connected) {
      try {
        await this.sftp.connect(JSON.parse(sftpConfig));
      } catch (error) { return await this.connect() }
    }
  }

  async put(localFilePath, remoteFilePath) {
    try {
      const result = await this.sftp.put(localFilePath, remoteFilePath);
      return result;
    } catch (error) {return ''}
  }

  async get(remoteFilePath, localFilePath) {
    try {
      const result = await this.sftp.get(remoteFilePath, localFilePath);
      return result;
    } catch (error) {return ''}
  }

  async read(remoteFilePath) {
    try {
      const result = await this.sftp.get(remoteFilePath);
      return result.toString();
    } catch (error) {return ''}
  }

  async save(remoteFilePath, data) {
    await this.sftp.put(Buffer.from(data), remoteFilePath);
  }

  async close() {
    await this.sftp.end();
  }
}

class ReferalFetcher {
  constructor (server) {
    this.server = server;
  }

  async init() {
    if (!this.server.players.lastStatsFetch)
      await this.server.fetchStats();

    await this.getReferals();

    this.referals.forEach(async (referal) => {
      if (referal.isAllChildrensConfirmed)
        return;

      let unconfirmedChildrens = referal.childrens.filter(children => !children.isConfirmed).length;
      let confirmedChildrens = 0;
      let hasBeenChanged = false;

      referal.childrens.forEach(async (children) => {
        const processedChildren = await this.processChildren(children);
        if (processedChildren) {
          unconfirmedChildrens--;
          confirmedChildrens++;
          hasBeenChanged = true;
        }
      });

      if (hasBeenChanged) {
        if (unconfirmedChildrens === 0) {
          referal.isAllChildrensConfirmed = true
        }
        await this.Referals.updateOne({ _id: referal._id }, { $set: referal });
        const referalPlayer = new MinecraftPlayer(referal.id);
        await referalPlayer.fetch();
        const totalConfirmedChildrens = referal.childrens.filter(children => children.isConfirmed).length;
        await referalPlayer.achievements.getEvent(totalConfirmedChildrens, confirmedChildrens);
        await referalPlayer.save();
      }
    });
  }

  async getReferals() {
    this.Referals = await getDatabase('referals');
    this.referals = await Referals.find({}).toArray();
    this.referals = this.referals.filter(referal => referal.childrens.length !== 0 && !referal.isAllChildrensConfirmed);
    return this.referals
  }

  async processChildren(children) {
    if (children.isConfirmed)
      return false;
    const player = new MinecraftPlayer(children.id);
    await player.fetch();
    await player.achievements.fetch();
    const playedTicks = player.achievements.select('custom', 'play_time');
    if (player.registered 
      && player.nickname 
      && typeof playedTicks === 'number' 
      && !isNaN(playedTicks) 
      && playedTicks / 20 / 60 / 60 > 50) {
        children.isConfirmed = true;
        return true
    } else {
      return false;
    }
  }
}

const mongo = new MongoClient(mongoLogin, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function databaseConnect() {
  try {
    if (!mongo.isConnected) {
      await mongo.connect();
    }
  } catch (error) {
    console.log(error)
  }
}

const locale = require(`./static/lang/locale.json`);

function getLanguagePack(languagePack = "en") {
  const languageProxy = new Proxy(locale, {
    get(target, prop) {
      if (Array.isArray(target[prop])) {
        return target[prop].map(item => item[languagePack]);
      } else if (typeof target[prop] === "string") {
        return target[prop];
      } else if (typeof target[prop]?.[languagePack] === "string") {
        return target[prop][languagePack];
      } else {
        const translations = {};
        for (const key in target[prop]) {
          if (target[prop]?.[key]?.[languagePack]) {
            translations[key] = target[prop]?.[key]?.[languagePack];
          }
        }
        return translations;
      }
    },
  });

  languageProxy.debugPath = __dirname;
  return languageProxy;
}

function generateToken(sumbolsLong) {
  return crypto.randomBytes(sumbolsLong).toString('hex');
}

async function getDatabase(collection) {
  if (!collection) return
  try {
    await databaseConnect();
    const Database = mongo.db().collection(collection);
    return Database;
  } catch (error) {
    console.log(error);
  }
}

function log(...args) {
  const colors = {
    r: "\u001b[31m",
    g: "\u001b[32m",
    y: "\u001b[33m",
    b: "\u001b[34m",
    p: "\u001b[35m",
    c: "\u001b[36m",
    o: "\u001b[0m"
  }

  let message = '';
  let color = 'o';
  for (const arg of args) {
    if (typeof arg === 'string') {
      if (arg in colors) {
        color = arg;
      } else {
        message += arg;
      }
    } else {
      const formattedJson = JSON.stringify(arg, null, 2);
      message += formattedJson;
    }
  }

  console.log(colors.b
               + "["
               + colors.c
               + formatDate().time
               + colors.b
               + "] "
               + colors[color]
               + message
               + colors.o
              );
}

function formatDate(toDate = false, isPrevDay = false) {
  let date = new Date();
  if (toDate) {
    date = new Date(toDate);
  }

  if (isPrevDay) {
    date.setDate(date.getDate() - 1);
  }

  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear().toString();

  return {
    time: `${hours}:${minutes}:${seconds}`,
    hour: `${hours}`,
    shortTime: `${hours}:${minutes}`,
    date: `${day}.${month}.${year}`,
    shortDate: `${hours}:${minutes} ${day}.${month}`
  };
}

async function getMultiBoard(ids) {
  const Battleboard = await getDatabase("battleboard");

  const numericIds = ids.map(id => parseInt(id)).filter(numericId => !isNaN(numericId));

  if (numericIds.length === 0) {
    return false;
  }

  const filter = { "id": { $in: numericIds } };
  const results = await Battleboard.sort({ id: -1 }).find(filter).toArray();

  return results.length > 0 ? results : false;
}

function reportCounter(battleboard) {
  const playersMap = new Map();
  const killsCountMap = new Map();
  const killFameMap = new Map();
  let maxPlayers = 0;
  let maxKills = 0;
  let maxKillFame = 0;

  const battleArray = Array.isArray(battleboard) ? battleboard : [battleboard];

  battleArray.forEach(battle => {
    for (const playerId in battle.players) {
      const player = battle.players[playerId];
      const guildName = player.guildName || player.name;
      const allianceName = player.allianceName || player.guildName;
      const guildKey = allianceName ? allianceName : guildName;

      if (!playersMap.has(guildKey)) {
        playersMap.set(guildKey, { guild: guildName, alliance: allianceName, players: 0 });
      }

      playersMap.get(guildKey).players++;
      maxPlayers = Math.max(maxPlayers, playersMap.get(guildKey).players);

      if (!killsCountMap.has(guildKey)) {
        killsCountMap.set(guildKey, { guild: guildName, alliance: allianceName, kills: 0 });
      }

      killsCountMap.get(guildKey).kills += player.kills;
      maxKills = Math.max(maxKills, killsCountMap.get(guildKey).kills);

      if (!killFameMap.has(guildKey)) {
        killFameMap.set(guildKey, { guild: guildName, alliance: allianceName, fame: 0 });
      }

      killFameMap.get(guildKey).fame += player.killFame;
      maxKillFame = Math.max(maxKillFame, killFameMap.get(guildKey).fame);
    }
  });

  const result = {
    players: [],
    killsCount: [],
    killFame: []
  };

  for (const [key, data] of playersMap.entries()) {
    const widthPercentage = Math.round((data.players / maxPlayers) * 80);
    result.players.push({ width: `${widthPercentage}%`, players: data.players, guild: data.guild, alliance: data.alliance });
  }

  for (const [key, data] of killsCountMap.entries()) {
    const killsWidthPercentage = Math.round((data.kills / maxKills) * 80);
    result.killsCount.push({ width: `${killsWidthPercentage}%`, kills: data.kills, guild: data.guild, alliance: data.alliance });
  }

  for (const [key, data] of killFameMap.entries()) {
    const fameWidthPercentage = Math.round((data.fame / maxKillFame) * 80);
    result.killFame.push({ width: `${fameWidthPercentage}%`, fame: data.fame, guild: data.guild, alliance: data.alliance });
  }

  result.players = result.players
    .sort((a, b) => b.players - a.players)
    .slice(0, 4);

  result.killsCount = result.killsCount
    .sort((a, b) => b.kills - a.kills)
    .slice(0, 4);

  result.killFame = result.killFame
    .sort((a, b) => b.fame - a.fame)
    .slice(0, 4);

  return result;
}

function ftpUpload(filePathOnHost) {
  const ftpClient = new ftp();
  const ftpConfig = {
    host: 'ftpupload.net',
    user: 'b12_33593520',
    password: 'requestUserPassword'
  };

  const absoluteFilePath = path.join(__dirname, 'static/images/', filePathOnHost);

  ftpClient.on('ready', () => {
    ftpClient.put(absoluteFilePath, `/api.impactium.fun/htdocs/${filePathOnHost}`, (err) => {
      if (err) {
        console.error('Ошибка при загрузке файла:', err);
      }
      ftpClient.end();
    });
  });

  ftpClient.connect(ftpConfig);
}

function purge(sourse) {
  return JSON.parse(fs.readFileSync(sourse, 'utf-8'));
}

async function getBattleBoard(params = false) {
  const { battlesLimit = 50, minimumPlayers = 10, minimumGuildPlayers = 5 } = params.filters || {}
  await databaseConnect();
  const Battleboard = await getDatabase("battleboard");

  try {
    if (params) {
      if (Array.isArray(params.base)) { // Массборд
        return await getMultiBoard(params.base);
      }

      const id = parseInt(params.base);
      if (typeof id === "number" && !isNaN(id)) { // Поиск по id
        const battle = await Battleboard.findOne({ id });
        return battle || false;
      }      
  
      if (typeof params.base === "string") {
        const normalizedName = params.base.toLowerCase();

        const filter = {
          $or: []
        };
        
        const totalRecords = await Battleboard.countDocuments();

        const cursor = Battleboard.find({}).skip(totalRecords - 5000);
        
        while (await cursor.hasNext()) {
          const battle = await cursor.next();

          const players = Object.values(battle.players);
        
          const isBattleValid = players.length >= minimumPlayers &&
                                players.filter(player => (
                                  player.guildName.toLowerCase() === normalizedName || 
                                  player.allianceName.toLowerCase() === normalizedName
                                )).length >= minimumGuildPlayers;
          
          if (isBattleValid) {
            filter.$or.push({ "_id": battle._id });
          }
          
          if (filter.$or.length >= battlesLimit) {
            break;
          }
        }

        const result = await Battleboard.find({ $or: filter.$or }).toArray();
        return result;
      }
    }
    const battleboard = await Battleboard.find({}).sort({ id: -1 }).limit(battlesLimit).toArray();
    return battleboard;
  } catch (error) {
    console.log(error);
    return []
  }
}

function getLicense() {
  try {
    const path = 'C:\\Users\\Mark\\';

    const cert = fs.readFileSync(path + 'cert.pem', 'utf8');
    const key = fs.readFileSync(path + 'key.pem', 'utf8');

    return { isSuccess: true, cert, key };
  } catch (error) {
    return { isSuccess: false };
  }
}

async function deleteBattleRecords(limit) {
  const Battleboard = await getDatabase("battleboard");

  const records = await Battleboard.find().limit(limit).toArray();
  const idArray = records.map(record => record.id);

  await Battleboard.deleteMany({ id: { $in: idArray } });
}

async function saveBattleBoard(data) {
  const Battleboard = await getDatabase("battleboard");
  const existBattles = await Battleboard.find({ id: { $in: data.map(item => item.id) } }).toArray();

  data = data.filter(battle => !existBattles.some(existingBattle => existingBattle.id === battle.id)); // Фильтрация по несуществующим ID

  data = data.filter(battle => Object.keys(battle.players).length > 9); // Фильтрация по кол-ву игроков > 9

  if (data.length > 0) {
    await Battleboard.insertMany(data);
    await deleteBattleRecords(data.length);
  }
}

module.exports = {
  GuildStatisticsInstance,
  ResoursePackInstance,
  MinecraftPlayer,
  ImpactiumServer,
  saveBattleBoard,
  getLanguagePack,
  databaseConnect,
  getBattleBoard,
  getMultiBoard,
  reportCounter,
  generateToken,
  getDatabase,
  formatDate,
  getLicense,
  ftpUpload,
  Schedule,
  Referal,
  Guild,
  SFTP,
  User,
  log,
};

// BDo1SFG71T9IwmDA

// avatar: userPayload.picture || userPayload.avatar || userDatabase.avatar,
// displayName: userPayload.name || userPayload.global_name.replace(/'/g, '`') || undefined,
// locale: userPayload.locale || false,
// token: token,
// lastLogin: params.from
// lastLogin: params.from