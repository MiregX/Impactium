const { pterosocket } = require('pterosocket');
const SFTP = require('./SFTP');
const ResoursePack = require('./ResoursePack');
const ReferalFetcher = require('./ReferalFetcher');
const TelegramBotHandler = require('./TelegramBotHandler');
const { getDatabase } = require('../utils.js')
const { minecraftServerAPI} = process.env;

export default class ImpactiumServer {
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
    this.players = {
      online: {
        list: [],
        count: 0
      }
    }

    this.resourcePack = new ResoursePack(this);
    this.telegramBot = new TelegramBotHandler();
    this.referals = new ReferalFetcher(this);
    
    ImpactiumServer.instance = this;
  }

  launch() {
    this.server = new pterosocket(this.connect.origin, this.connect.api_key, this.connect.server_no);
    
    this.server.on("start", () => {
      log("WS Соединение с панелью управления установлено!", 'y');
      this.command('list', true);
    });
    
    this.server.on("console_output", (packet) => {
      this.output(packet.replace(/\x1b\[\d+m/g, '')) 
    });
  }

  command(command, isQuiet = false) {
    if (!this.server) throw new Error('Impactium Server doesn`t have a pterosocket connection');
    this.server.writeCommand(command);
    if (!isQuiet) log(`[MC] -> ${command}`, 'g');
  }

  output(message) {
    if (message.slice(0, 17).includes('WARN') || message.substring(17).startsWith('[Not Secure]'))
      return

    message = message.substring(17)

    if (message.endsWith('joined the game'))
      this.players.online.count++;
      this.players.online.list.push(message.split(' ')[0]);
      this.telegramBot.editMessage(this.players.online)

    if (message.endsWith('left the game'))
      this.players.online.count--;
      this.players.online.list = this.players.online.list.filter(p => p !== message.split(' ')[0]);
      this.telegramBot.editMessage(this.players.online)

    if (message.startsWith('Players:')) {
      const players = message.substring(9).split(', ');
      this.players.online.list = players.map(p => p.split(' ')[1]);
      this.players.online.count = players.length + 10
      log(this.players.online, 'r')
      this.telegramBot.editMessage(this.players.online);
    }

    if (message.endsWith('issued server command: /x'))
      applyAchievementEffect(message.split(" ")[0])
  }

  restart() {
    if (!this.server) throw new Error('Impactium Server doesn`t have a pterosocket connection');;
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