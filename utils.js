const fs = require('fs');
const ftp = require('ftp');
const Jimp = require('jimp');
const path = require('path');
const axios = require('axios');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');
const { spawn } = require('child_process');
const { pterosocket } = require('pterosocket')
const SftpClient = require('ssh2-sftp-client');
const locale = require(`./static/lang/locale.json`);
const { MongoClient, ServerApiVersion } = require('mongodb');
const { colors, mongoLogin } = JSON.parse(fs.readFileSync('json/codes_and_tokens.json'), 'utf8');

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
      await Users.updateOne({ _id: this._id }, { $set: this });
      this.isFetched = true;
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

  async fetch(id = this.id) {
    const Players = await getDatabase("minecraftPlayers");
    const player = await Players.findOne({
      $or: [
        { id },
        { discordId: id }
      ]
    });

    if (player) {
      Object.assign(this, player);
      this.isFetched = true;
    } else {
      await this.save()
    }
  }

  async setNickname(newNickname) {
    if (Date.now() - this.lastNicknameChangeTimestamp < 60 * 60 * 1000 && this.nickname) return 415;

    if (!/^[a-zA-Z0-9_]{3,32}$/.test(newNickname)) return 412;

    const Players = await getDatabase("minecraftPlayers");
    const possiblePlayerWithSameNickname = await Players.findOne({ nickname: newNickname });

    if (possiblePlayerWithSameNickname) return 416;

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

    if (width !== 64 || height !== 64) return 411;
    if (Date.now() - this.lastSkinChangeTimestamp < 24 * 60 * 60 * 1000) return 414;
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
    if (!/^[a-zA-Z0-9_]{3,32}$/.test(newPassword)) return 412;

    this.password = newPassword;
    await this.save()
    this.initAuthMe()
    return 200
  }

  async register() {
    if (!this.registered) {
      this.registered = Date.now()
      delete this.nicknameLastChangeTimestamp 
      await this.save()
    }
  }

  initAuthMe() {
    if (this.nickname && this.password) {
      const mcs = new ImpactiumServer();
      mcs.fetchWhitelist();
      mcs.command(`authme register ${this.nickname} ${this.password}`);
      mcs.command(`authme changepassword ${this.nickname} ${this.password}`);
    }
  }

  initAchievments() {
    return new MinecraftPlayerAchievementInstance(this);
  }

  async save() {
    const Players = await getDatabase("minecraftPlayers");
    const player = await Players.findOne({ _id: this._id });

    if (player || this._id) {
      delete this.isFetched
      await Players.updateOne({ _id: this._id }, { $set: this });
      this.isFetched = true;
    } else {
      delete this.isFetched
      await Players.insertOne(this);
      this.isFetched = true;
    }
  }
}

class MinecraftPlayerAchievementInstance extends MinecraftPlayer {
  constructor(player) {
    super(player ? player.id : null)

    if (player) {
      Object.assign(this, player);
    }
  }

  setAchievement(type) {
    if (!this.achievements) this.achievements = {};
    const validTypes = ['permissions', 'events', 'casual', 'warrior', 'killer', 'donate']
    if (!validTypes.includes(type)) return 400;

    this.achievements[type] = { 
      type
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
      api_key: "ptlc_UTbPzglyHG6y2EtNJA9HkN1qIASd51THGqWUuZMXjFJ",
      server_no: "d9aa118c"
    }
    
    ImpactiumServer.instance = this;
  }

  launch() {
    this.server = new pterosocket(this.connect.origin, this.connect.api_key, this.connect.server_no);

    this.server.on("start", ()=>{
      log("WS Соединение с панелью управления установлено!", 'y')
    })
  }

  command(command) {
    if (!this.server) return false;
    this.server.writeCommand(command);
    log(`[MC] -> ${command}`, 'g')
    return true;
  }

  async fetchWhitelist() {
    await this.sftp.connect()
    const nicknames = await getPlayersNicknamesArray()
    const players = JSON.parse(await this.sftp.read('whitelist.json'));

    nicknames.forEach(nickname => {
      const existPlayer = players.find(player => player.name === nickname)
      if (!existPlayer) {
        this.command(`whitelist add ${nickname}`)
      }
    });

    players.forEach(player => {
      if (!nicknames.includes(player.name)) {
        this.command(`whitelist remove ${player.name}`)
      }
    })

    this.command('whitelist reload');
    await this.sftp.close()
  }

  async fetchAchievements() {
    await this.sftp.connect()
    try {
      let players = JSON.parse(await this.sftp.read('whitelist.json'));
      const results = [];
  
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
      return results;
    } catch (error) { return [] }
  }

  async fetchResoursePackIcons() {
    this.path.folder.icons = path.join(__dirname, 'static', 'images', 'minecraftPlayersSkins');
    this.path.file.basic = path.join(__dirname, 'static', 'defaultRPIconsSourseFile.json');
    this.path.folder.resoursePackIcons = path.join(__dirname, 'resourse_pack', 'assets', 'minecraft', 'textures', 'font');
    this.path.file.resoursePackJson = path.join(__dirname, 'resourse_pack', 'assets', 'minecraft', 'font', 'default.json');

    await this.sftp.connect()
    const whitelistedPlayers = JSON.parse(await this.sftp.read('whitelist.json'));
    const resultedJson = purge(this.path.file.basic);
  
    const Players = await getDatabase("minecraftPlayers");
    await Promise.all(whitelistedPlayers.map(async (playerWhitelistObj, index) => {
      const player = await Players.findOne({ nickname: playerWhitelistObj.name });
  
      if (player?.skin?.iconLink) {
        const playerName = player.nickname.toLowerCase();
        const playerChar = String.fromCharCode(index + 5000);
        const playerCode = `\\u${(index + 5000).toString(16).padStart(4, '0')}`;

        resultedJson.providers.push({
          type: "bitmap",
          file: `minecraft:font/${playerName}.png`,
          ascent: 8,
          height: 8,
          chars: [JSON.parse(`"${playerCode}"`)]
        });
  
        // Путь к исходной картинке
        const sourceImagePath = `${this.path.folder.icons}\\${player.id}_icon.png`;
        const destinationImagePath = `${this.path.folder.resoursePackIcons}\\${playerName}.png`;
  
        try {
          await fs.promises.copyFile(sourceImagePath, destinationImagePath);
          this.command(`lp user ${player.nickname} meta setprefix 2 "${playerChar} "`);
        } catch (error) {
          const playerIndex = resultedJson.providers.findIndex(provider => provider.file === `minecraft:font/${playerName}.png`);
          if (playerIndex !== -1) {
            resultedJson.providers.splice(playerIndex, 1);
          }
        }
      }
    }));
  
    try {
      console.log(resultedJson)
      fs.writeFileSync(this.path.file.resoursePackJson, JSON.stringify(resultedJson, null, 2), 'utf-8');
    } catch (error) {
      console.log(error)
    }
  }

  async processResoursePackIcons() {
    this.path.file.resoursePackJson = path.join(__dirname, 'resourse_pack', 'assets', 'minecraft', 'font', 'default.json');
    const playersWithFetchedIcon = purge(this.path.file.resoursePackJson);
    playersWithFetchedIcon.forEach((playerObj, index) => {
      if (index < 3) return
      const playerNickname = playerObj.file.replace(/^minecraft:font\//, '').replace(/\.png$/, '')
      this.command(`user ${playerNickname} meta setprefix 2 "${playerObj.chars[0]} "`);
    })
  }
}

class SFTP {
  constructor() {
    if (!SFTP.instance) {
      this.sftp = new SftpClient();
      this.config = {
        host: 'd27.joinserver.xyz',
        port: 7477,
        username: 'b8rj8c2t.d9aa118c',
        password: 'Eevee888'
      };
      SFTP.instance = this;
    }

    return SFTP.instance;
  }

  async connect() {
    if (!this.sftp.connected) {
      await this.sftp.connect(this.config);
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

  async close() {
    await this.sftp.end();
  }
}

module.exports = SFTP;


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

// users.find(user => {
//   (user[user.lastLogin].id === id) ||
//   (user[user.lastLogin].email === email)
// });

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
  const Battleboard = mongo.db().collection("battleboard");

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

const mongo = new MongoClient(mongoLogin, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function databaseConnect() {
  if (!mongo.isConnected) {
    await mongo.connect();
  }
}

function purge(sourse) {
  return JSON.parse(fs.readFileSync(sourse, 'utf-8'));
}

async function getBattleBoard(params = false) {
  const { battlesLimit = 50, minimumPlayers = 10, minimumGuildPlayers = 5 } = params.filters || {}
  await databaseConnect();
  const Battleboard = mongo.db().collection("battleboard");

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

async function getPlayersNicknamesArray() {
  const Players = await getDatabase("minecraftPlayers");
  const distinctNicknames = await Players.find({}, { _id: 0, nickname: 1 }).toArray();
  const nicknames = distinctNicknames.map(player => player.nickname).filter(n => n);
  return nicknames
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
  MinecraftPlayerAchievementInstance,
  GuildStatisticsInstance,
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
  Guild,
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