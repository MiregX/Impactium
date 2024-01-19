require('dotenv').config();
const fs = require('fs');
const ejs = require('ejs');
const cors = require('cors');
const path = require('path');
const https = require('https');
const vhost = require('vhost');
const utils = require('./utils');
const express = require('express');
const { schedule } = require('node-cron');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const { User, ImpactiumServer, MinecraftPlayer, getLanguagePack, log } = require('./utils');

const app = express();

app.use(session({
  secret: process.env.discordClientSecret,
  resave: false,
  saveUninitialized: false,
}));

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use('/static', express.static('static', { setHeaders: (response, path) => { response.setHeader('Cache-Control', 'public, max-age=6000000'); }}));

app.set('view engine', 'ejs');

global.logged = global.logged || new Map();

const options = utils.getLicense();

const api = require('./modules/api');
app.use('/api', api);

const mcs = new ImpactiumServer()
const nav = {
  "partners": {
    "kavuryarnya": {
      "name": "Кавунярня",
      "logo": "https://cdn.discordapp.com/icons/1060561700123840582/f8ca992b9aa561a23a5f840dbada56a5.webp?size=96",
      "description": "Приємний сервер",
      "action": "https://discord.gg/cCCGxfQnzY"
    },
    "mythology": {
      "name": "Mythology",
      "logo": "https://cdn.discordapp.com/icons/1086575520214437888/3ed5f68e7cfe818d8976b412f68d2074.webp?size=256",
      "description": "Trixel`s AO guild",
      "action": ""
    }
  },
  "products": {
    "mcs": {
      "name": "Minecraft Server",
      "logo": "https://api.impactium.fun/logo/impactium-tw.png",
      "description": "Майнкрафт сервер.",
      "action": "https://impactium.fun/me"
    },
    "discord": {
      "name": "Impactium Bot",
      "logo": "https://api.impactium.fun/logo/impactium-wb.png",
      "description": "Автороли для альянса.",
      "action": "https://discord.com/oauth2/authorize?client_id=1123714909356687360&scope=bot&permissions=8"
    }
  },
  "contact": {
    "telegram": {
      "name": "Our Telegram",
      "logo": "https://api.impactium.fun/logo/impactium-bw.png",
      "description": "Impactium | Кошмаринг",
      "action": "https://t.me/impactium"
    }
  }
}

const middleware = async (request, response, next) => {
  try {
    if (request.query.ref) {
      if (!request.cookies.referal) {
        response.cookie('referal', request.query.ref, { domain: '.impactium.fun', secure: true, maxAge: 31536000000 });
        response.cookie('referal', request.query.ref);
      }
      return response.redirect(request.path);
    }

    const user = new User();
    await user.fetch(request.cookies.token);

    const lang = getLanguagePack(request.cookies.lang);

    request.composed = { user, lang };
    request.user = user;
    request.lang = lang;

    next();
  } catch (error) {
    console.log(error);
    response.sendStatus(500);
  }
};

app.use('/', middleware);

app.get('/', (request, response) => {
  try {
    const body = ejs.render(fs.readFileSync('views/index.ejs', 'utf8'), request.composed);
    response.render('template.ejs', { ...request.composed, body, nav });
  } catch (error) {
    console.log(error);
    response.sendStatus(500);
  }
});

app.get('/login', (request, response) => {
  if (request.user.id) return response.redirect('/');
  const previousPage = request.header('Referer') || '/';
  response.cookie('previousPage', previousPage, { domain: '.impactium.fun', secure: true });
  
  try {
    const loginTemplate = fs.readFileSync('views/login.ejs', 'utf8');
    const body = ejs.render(loginTemplate, { lang: request.lang });

    response.render('template.ejs', {
      body,
      user: request.user,
      lang: request.lang
    });
  } catch (error) {
    console.error(error);
    response.redirect('/');
  }
});

app.get('/logout', (request, response) => {
  global.logged.delete(request.ip);
  response.clearCookie('token', { domain: '.impactium.fun' });
  response.clearCookie('token');
  response.redirect('/');
});

app.get('/l', (request, response) => {
  response.clearCookie('referal', { domain: '.impactium.fun' });
  response.clearCookie('referal');
  response.redirect('/');
});

app.get('/error', (request, response) => {
  response.render('error.ejs', { lang: request.lang })
});

app.get('/lang/:lang', (request, response) => {
  response.cookie('lang', request.params.lang, { domain: '.impactium.fun', secure: true });
  response.cookie('lang', request.params.lang);
  response.redirect('back');
});

app.get('/set-token/:token', (request, response) => {
  const token = request.params.token;
  response.cookie('token', token);
  response.cookie('token', token, { domain: '.impactium.fun', secure: true, maxAge: 31536000000 });
  response.redirect('back');
});

app.get('/status', (request, response) => {
  response.sendStatus(200);
});

const terminalRouter = require('./modules/terminal');
app.use('/terminal', terminalRouter);

const meApp = require('./modules/me');
app.use('/me', meApp);

const oauth2 = require('./modules/oauth2');
app.use('/oauth2', oauth2);

app.use((err, req, res, next) => {
  res.redirect('/')
});

app.use((req, res, next) => {
  res.redirect('/error')
});

const server = https.createServer(options, app)

options.isSuccess
? // Если ключ правильный и сертификат найден
server.listen(80, async () => {
  log(`Основной сервер запущен`, 'g');
  processHosting();
})
: // Если ключ неправильный или не найден
app.listen(3001, () => { 
  log(`Тестовый сервер запущен`);
})

const processHosting = async () => {
  try {
    mcs.launch();
    await mcs.updateWhitelist();
    await mcs.fetchStats();
  } catch (error) {
    console.log(error);
  }
}

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  // Можно предпринять какие-то действия для продолжения работы приложения
});

// process.on('unhandledRejection', (reason, promise) => {
//   console.error('Unhandled Rejection:', reason);
//   mcs.telegramBot.connect
//   mcs.launch();
// });


schedule('0 */6 * * *', async () => {
  await mcs.resourcePack.process();
});
schedule('0 0 * * *', async () => {
  await mcs.resourcePack.process();
  await mcs.referals.init();
});
schedule('*/10 * * * *', async () => {
  mcs.command('list', true);
  await mcs.fetchStats();
});