const fs = require('fs');
const { Telegraf, Markup } = require('telegraf');
const { clientSecret } = JSON.parse(fs.readFileSync('json/codes_and_tokens.json', 'utf8'));
const { getDatabase, saveDatabase, log } = require('./utils');
const { Utils } = require('discord.js');

const bot = new Telegraf("6072469520:AAGQ1hitcNM1tnwzMGT8v_4i8h-3QFdLod8");

bot.start((ctx) => {
  ctx.reply('Choose language for this session', {
    reply_markup: {
      inline_keyboard: [
        [{ text: '🇺🇸', callback_data: 'en' }, { text: '🇷🇺', callback_data: 'ru' }],
        [{ text: '🇺🇦', callback_data: 'uk' }, { text: '🇰🇿', callback_data: 'kz' }, { text: '🇩🇪', callback_data: 'de' }]
      ]
    }
  });

  /*utils.pushTelegramUser(ctx.message.from);*/
});

bot.action('update_button', async (ctx) => {
  return
  try {
    const database = getDatabase();

    const userPayload = {
      id: ctx.from.id,
      name: ctx.from.username
    }

    const foundUser = database.telegram.users.find(user => user.id === userPayload.id);
    const foundAlbionGiveaway = database.telegram.albionGiveaway.find(user => user.id === userPayload.id);

    const channelId = '-1001649611744';
    const isMember = await ctx.telegram.getChatMember(channelId, userPayload.id)
      .then(member => member.status === 'member')
      .catch(() => false);

    if (!foundUser) {
      database.telegram.users.push(userPayload);
    }

    if (!foundAlbionGiveaway && isMember) {
      database.telegram.albionGiveaway.push(userPayload);

      const chatId = '-1001649611744';

      const buttonText = `${database.telegram.albionGiveaway?.length} участников`;

      const inlineKeyboard = {
        inline_keyboard: [[{ text: buttonText, callback_data: 'update_button' }]],
      };

      await ctx.telegram.editMessageReplyMarkup(chatId, database.telegram.buttonMessageId, null, inlineKeyboard);

      ctx.answerCbQuery('You have joined the giveaway! 🎉');
      saveDatabase(database);
    } else if (!isMember) {
      ctx.answerCbQuery('You must subscribe to the channel to participate.');
    } else {
      ctx.answerCbQuery('You are already participating!');
    }
  } catch (error) {
    log(error.message);
  }
});

function launchBot() {
  bot.launch()
    .then(() => {
      log('Telegram Bot запущен...', 'c');
    })
    .catch((error) => {
      setTimeout(launchBot, 1000);
    });
}

launchBot();
