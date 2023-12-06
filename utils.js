const fs = require('fs');
const ftp = require('ftp');
const Jimp = require('jimp');
const path = require('path');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');
const locale = require(`./static/lang/locale.json`);
const { colors, mongoLogin } = JSON.parse(fs.readFileSync('json/codes_and_tokens.json'), 'utf8');
const { MongoClient, ServerApiVersion } = require('mongodb');

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
    return 200
  }
  
  async setSkin(originalImageName, imageBuffer, timestamp) {
    const image = await Jimp.read(imageBuffer);
    const { width, height } = image.bitmap;

    if (width !== 64 || height !== 64) return 411;
    if (Date.now() - this.lastSkinChangeTimestamp < 24 * 60 * 60 * 1000) return 414;
    if (!this.skin) this.skin = {}

    const defaultPlayersSkinsFolderPath = "https://api.impactium.fun/minecraftPlayersSkins/";
    this.skin.iconLink = `${defaultPlayersSkinsFolderPath}${this.id}_icon_${timestamp}.png`;
    this.skin.charlink = `${defaultPlayersSkinsFolderPath}${this.id}.png`;
    this.skin.originalTitle = originalImageName;
    this.lastSkinChangeTimestamp = timestamp;
    await this.save();
    return 200
  }

  async register() {
    if (!this.registered) {
      this.registered = Date.now()
      delete this.lastNicknameChangeTimestamp 
      await this.save()
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
    this.whitelistPath = path.join(__dirname, 'minecraft_server', 'whitelist.json');
    this.achievementsFolder = path.join(__dirname, 'minecraft_server', 'world', 'stats');
  }

  async fetchWhitelist() {
    const Players = await getDatabase("minecraftPlayers");
    const distinctNicknames = await Players.find({}, { _id: 0, nickname: 1 }).toArray();
    const nicknames = distinctNicknames.map(player => player.nickname).filter(n => n);
    const whitelistedPlayers = JSON.parse(fs.readFileSync(this.whitelistPath, 'utf-8'));
    
    const newWhitelistFile = []
    nicknames.forEach(nickname => {
      const existPlayer = whitelistedPlayers.find(player => player.name === nickname)
      if (existPlayer) {
        newWhitelistFile.push(existPlayer)
      } else {
        newWhitelistFile.push({ uuid: uuidv4(), name: nickname })
      }
    });

    fs.writeFileSync(this.whitelistPath, JSON.stringify(newWhitelistFile, null, 2), 'utf-8')
  }

  async fetchAchievements() {
    const players = JSON.parse(fs.readFileSync(this.whitelistPath, 'utf-8'));
  
    await Promise.all(players.map(async (player, index) => {
      const playerAchievementsFilePath = path.join(this.achievementsFolder, `${player.uuid}.json`);
      
      try {
        const playerAchievements = fs.readFileSync(playerAchievementsFilePath, 'utf-8');
        player.stats = JSON.parse(playerAchievements).stats;
        players[index] = player;
      } catch (error) {
        players.splice(index, 1);
      }
    }));

    return players;
  }
}

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