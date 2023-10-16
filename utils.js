const fs = require('fs');
const ftp = require('ftp');
const path = require('path');
const axios = require('axios');
const crypto = require('crypto');
const { colors, mongoLogin } = JSON.parse(fs.readFileSync('json/codes_and_tokens.json'), 'utf8');
const { MongoClient, ServerApiVersion } = require('mongodb');

function getUserDataByToken(token) {
  const database = getDatabase();
  const user = database.users.find(user => user.token === token);

  if (!user) {
    return false;
  }

  if (user) {
    Object.assign(user, user[user.lastLogin]);
    const { token, secure, ...rest } = user;
    return rest;
  }

  log("ПРОИЗОШЛА ХУЙНЯ, ПОЛЬЗОВАТЕЛЬ НАЕБАЛ СИСТЕМУ!", 'r');
}

function getLanguagePack(languagePack = "en") {
  let lang;
  try {
    lang = require(`./static/lang/${languagePack}.json`);
  } catch (err) {
    lang = require(`./static/lang/en.json`);
  }
  return lang;
}

function userAuthentication(p) {
  const loginSource = p.from;
  const userPayload = p.data;
  try {
    if (userPayload.error || userPayload.message) return { error: "Error during authorization" };

    const token = generateToken(64);
    const database = getDatabase();
    let userDatabase;
    if (userPayload.email) {
      userDatabase = database.users.find(user => user[loginSource].email === userPayload.email);
    } else {
      userDatabase = database.users.find(user => user[loginSource].id === (userPayload.sub || userPayload.id))
    }

    let avatar = undefined;

    if (loginSource === "google" && userPayload.picture) {
      avatar = userPayload.picture
    } else if (loginSource === "discord" && userPayload.avatar) {
      avatar = `https://cdn.discordapp.com/avatars/${userPayload.id}/${userPayload.avatar}.png`
    }

    const userToSave = {
      lastLogin: loginSource,
      token: token,
    }

    userToSave[loginSource] = {
      id: userPayload.sub || userPayload.id,
      email: userPayload.email || undefined,
      avatar: avatar,
      displayName: userPayload.name || userPayload.global_name.replace(/'/g, '`') || undefined,
      locale: userPayload.locale || "en",
      token: token
    }

    if (userDatabase) {
      Object.assign(userDatabase, userToSave);
    } else {
      database.users.push(userToSave);
    }

    saveDatabase(database);
    return { lang: userToSave[loginSource].locale, token };
  } catch (error) {
    console.log(error);
  }
}

// users.find(user => {
//   (user[user.lastLogin].id === id) ||
//   (user[user.lastLogin].email === email)
// });

function generateToken(sumbolsLong) {
  return crypto.randomBytes(sumbolsLong).toString('hex');
}

function saveNewGuildLanguage(lang, guildId) {
  const database = getDatabase()
  const languagePack = database.guilds.find(guildObj => guildObj.guildId === guildId);

  languagePack.guildMainLanguage = lang;

  saveDatabase(database);
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
    shortTime: `${hours}:${minutes}`,
    date: `${day}.${month}.${year}`,
    shortDate: `${hours}:${minutes} ${day}.${month}`
  };
}

function getDatabase() {
  const database = JSON.parse(fs.readFileSync('json/database.json', 'utf8'));
  return database;
}

function saveDatabase(database) {
  fs.writeFileSync('json/database.json', JSON.stringify(database, null, 2), 'utf8');
}

function getStatistics(isFilter = false) {
  let statistics = JSON.parse(fs.readFileSync('json/statistics.json', 'utf8'));
  
  if (isFilter) {
    statistics = statistics.slice(-7);
  }
  
  return statistics;
}

function saveStatistics(statistics) {
  fs.writeFileSync('json/statistics.json', JSON.stringify(statistics, null, 2), 'utf8');
}

function setStatistics(statParam, count = 1, guild = "unset") {
  let statistics = getStatistics();
  
  if (typeof count === 'string') {
    count = parseInt(count);
  }
  
  const today = formatDate(false).date;
  const thisDay = statistics.find(object => object.day === today);
  
  if (thisDay) {
    thisDay.stats[statParam] += count;
    saveStatistics(statistics);
  } else {
    createNewStatisticsDay();
  }
}

function createNewStatisticsDay() {
  let statistics = getStatistics();
  const today = formatDate(false).date;
  const yesterday = formatDate(true).date;
  const newDayData = {
    day: today,
    stats: {
      mainWebJoins: 0,
      guildsWebJoins: 0,
      ctaWebJoins: 0,
      regearWebJoins: 0,
      ctaTickets: 0,
      regearTickets: 0,
      userInfoJoins: 0,
      logins: 0,
      logouts: 0,
      langen: 0,
      langit: 0,
      langis: 0,
      langru: 0,
      languk: 0,
      discordBotAllComs: 0,
      discordBotSumbalComs: 0,
      discordBotAddbalComs: 0,
      discordBotRembalComs: 0,
      documentationJoins: 0
    }
  };

  statistics.push(newDayData);
  saveStatistics(statistics);
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

  result.winner = calculateWinnerGuild(result);

  return result;
}

function calculateWinnerGuild(result) {
  const guildCounts = {};
  let guild = false;
  let alliance = false;

  for (const category in result) {
    const firstGuild = result[category][0].guild;
    const firstAlliance = result[category][0].alliance;

    guildCounts[firstGuild] = (guildCounts[firstGuild] || 0) + 1;
    
    if (guildCounts[firstGuild] >= 2) {
      guild = firstGuild;
      if (!alliance) {
        alliance = firstAlliance;
      }
      break;
    }
  }

  return { guild, alliance };
}

function ftpUpload(filePathOnHost) {
  const ftpClient = new ftp();
  const ftpConfig = {
    host: 'ftpupload.net',
    user: 'b12_33593520',
    password: 'loginandpass'
  };

  const absoluteFilePath = path.join(__dirname, 'static/img/', filePathOnHost);

  ftpClient.on('ready', () => {
    ftpClient.put(absoluteFilePath, `/api.impactium.fun/htdocs/static/img/${filePathOnHost}`, (err) => {
      if (err) {
        console.error('Ошибка при загрузке файла:', err);
      }
      ftpClient.end();
    });
  });
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
  const { battlesLimit = 50, minimumPlayers = 10, minimumGuildPlayers = 1 } = params.filters || {}
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

        const cursor = Battleboard.find({}).skip(totalRecords - 500);
        
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
        

        const result = (filter.$or.length > 0) ? await Battleboard.find({ $or: filter.$or }).skip(totalRecords - 500).toArray() : [];
        log(result);
        return result;
      }
    }
    const battleboard = await Battleboard.find({}).sort({ id: -1 }).limit(50).toArray();
    return battleboard;
  } catch (error) {
    console.log(error);
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
async function saveBattleBoard(data) {
  const existBattles = await mongo.db().collection("battleboard").find({ id: { $in: data.map(item => item.id) } }).toArray();

  data = data.filter(battle => !existBattles.some(existingBattle => existingBattle.id === battle.id)); // Фильтрация по несуществующим ID

  data = data.filter(battle => Object.keys(battle.players).length > 9); // Фильтрация по кол-ву игроков > 9

  if (data.length > 0) {
    await mongo.db().collection("battleboard").insertMany(data);
  }
}

module.exports = {
  saveNewGuildLanguage,
  getUserDataByToken,
  userAuthentication,
  saveBattleBoard,
  getLanguagePack,
  getBattleBoard,
  setStatistics,
  getStatistics,
  getMultiBoard,
  reportCounter,
  generateToken,
  saveDatabase,
  getDatabase,
  formatDate,
  getLicense,
  ftpUpload,
  log,
};

// BDo1SFG71T9IwmDA

// avatar: userPayload.picture || userPayload.avatar || userDatabase.avatar,
// displayName: userPayload.name || userPayload.global_name.replace(/'/g, '`') || undefined,
// locale: userPayload.locale || false,
// token: token,
// lastLogin: params.from