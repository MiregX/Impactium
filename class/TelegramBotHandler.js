const { Telegraf, Markup } = require('telegraf');
const { telegramBotToken } = process.env;

class TelegramBotHandler {
  constructor() {
    if (TelegramBotHandler.instance) return TelegramBotHandler.instance;
    this.channelId = '-1001649611744'
    this.messageId = 676
    this.basicMessage = `Сейчас на сервере:\n`
    this.bot = new Telegraf(telegramBotToken)
    TelegramBotHandler.instance = this
  }

  async connect() {
    try {
      await this.bot.telegram.getMe();
    } catch (error) {
      return await this.connect();
    }
  }

  async editMessage(online) {
    await this.connect()
    
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
    } catch (error) { }
  }
}

exports.TelegramBotHandler = TelegramBotHandler;