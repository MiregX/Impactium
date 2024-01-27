const { Telegraf, Markup } = require('telegraf');
const { telegramBotToken } = process.env;
var utils

class TelegramBotHandler {
  constructor() {
    if (TelegramBotHandler.instance) return TelegramBotHandler.instance;
    utils = require('../utils');
    this.lastPlayersAmount = 0;
    this.lastPlayersList = []
    this.channelId = '-1001649611744'
    this.messageId = 676
    this.basicMessage = `Сейчас на сервере:\n`
    this.bot = new Telegraf(telegramBotToken)
    TelegramBotHandler.instance = this
  }

  async connect() {
    if (!this.connected) {
      try {
        await this.bot.telegram.getMe();
        utils.log('TelegramBotHandler.connect() --> Success', 'g');
        this.connected = true;
      } catch (error) {
        utils.log('TelegramBotHandler.connect() --> Connection failed. New attempt...', 'r');
        await this.connect();
      }
    }
  }

  async editMessage(online) {
    await this.connect();

    const isPreviousAmountOfPlayersIsSame = online.count === this.lastPlayersAmount;
    const isPreviousListOfPlayersIsSame = online.list.join('/') === this.lastPlayersList;
    
    if (isPreviousAmountOfPlayersIsSame && isPreviousListOfPlayersIsSame) {
      return
    }
    
    try {
      await this.bot.telegram.editMessageText(
        this.channelId,
        this.messageId,
        null,
        this.basicMessage,
        Markup.inlineKeyboard([
          Markup.button.callback(`Онлайн: ${online.count} / 50`, 'onlineButtonCallback'),
        ])
      );
    } catch (error) {
      if (error.response?.error_code === 400)
        return;
      
      if (error.response?.error_code === 429)
        return;

      utils.log('TelegramBotHandler.editMessage() --> Some error. Add parse to see more', 'r');
      this.editMessage(online);
      console.log(error)
    } finally {
      this.lastPlayersAmount = online.count
      this.lastPlayersList = online.list.join('/');
    }
  }
}

exports.TelegramBotHandler = TelegramBotHandler;