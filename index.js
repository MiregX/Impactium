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

const govApp = require('./modules/goverment/gov');
app.use(vhost('gov.impactium.fun', govApp));

const mcs = new ImpactiumServer()
const nav = {
  "partners": {
    "fax": {
      "name": "Кавунярня",
      "logo": "https://cdn.discordapp.com/icons/1060561700123840582/f8ca992b9aa561a23a5f840dbada56a5.webp?size=96",
      "description": "Приємний сервер",
      "action": "https://discord.gg/cCCGxfQnzY"
    },
    "spwordls": {
      "name": "SPWordls",
      "logo": "https://cdn.discordapp.com/icons/648968606734090250/a_1d805b6a79ebf012dff6dbde3715f93b.webp?size=256",
      "description": "Сервер Пятёрки",
      "action": "https://spworlds.ru/"
    },
    "libertyRust": {
      "name": "Liberty Rust",
      "logo": "https://cdn.discordapp.com/icons/1044602567063261274/17cb7fcad1b9b49c831ddd293a509226.webp?size=256",
      "description": "Українські сервери Rust",
      "action": "https://liberty-rust.com.ua/"
    },
    "bdu": {
      "name": "BDU",
      "logo": "https://cdn.discordapp.com/icons/1018142775230865408/e6f8f55eaec5edb5d15ecee933628826.webp?size=256",
      "description": "Великий україномовний колектив",
      "action": "https://discord.gg/zxczABBEGz"
    },
    "snf": {
      "name": "Sex & Fles",
      "logo": "https://cdn.discordapp.com/icons/1075444237895749783/7f16a37d7835058af4550aa405f5f9db.webp?size=256",
      "description": "AO Tier 1 guild",
      "action": ""
    },
    "mythology": {
      "name": "Mythology",
      "logo": "https://cdn.discordapp.com/icons/1086575520214437888/3ed5f68e7cfe818d8976b412f68d2074.webp?size=256",
      "description": "Dead AO guild",
      "action": ""
    }
  },
  "products": {
    "discord": {
      "name": "Impactium Bot",
      "logo": "https://api.impactium.fun/logo/impactium-wb.png",
      "description": "Автороли для альянса.",
      "action": "https://discord.com/oauth2/authorize?client_id=1123714909356687360&scope=bot&permissions=8"
    },
    "metrix": {
      "name": "Eclipse Metrix",
      "logo": "https://api.impactium.fun/logo/eclipsemetrix.png",
      "description": "Statistics for Albion Online.",
      "action": "/metrix"
    },
    "php": {
      "name": "PHP Compiler",
      "logo": "https://api.impactium.fun/logo/php-compiler.jpeg",
      "description": "School assistant project.",
      "action": "/php"
    }
  },
  "contact": {
    "telegram": {
      "name": "Our Telegram",
      "logo": "https://api.impactium.fun/logo/impactium-bw.png",
      "description": "Impactium | Кошмаринг",
      "action": "https://t.me/impactium"
    },
    "discord": {
      "name": "Our Discord",
      "logo": "https://cdn.discordapp.com/icons/673965541987319818/3aed0d0f7cab0d8ba11d0f1ace308684.webp?size=96",
      "description": "Impactium | Сообщество",
      "action": "https://discord.com/invite/W7yNDPJ"
    }
  }
}  

app.get('/', (request, response) => {
  try {
    const user = new User();
    user.fetch(request.cookies.token).then( async () => {
      const player = new MinecraftPlayer();
      await player.fetch(user._id);
      const lang = getLanguagePack(request.cookies.lang);
      const body = ejs.render(fs.readFileSync('views/index.ejs', 'utf8'), { user, lang, nav, player });
      
      response.render('template.ejs', { body, user, lang, nav });
    });
  } catch (error) {
    console.log(error, 'r');
    response.redirect('/');
  }
});

app.get('/login', (request, response) => {
  const user = new User(request.cookies.token);
  if (user.id) return response.redirect('/');
  const lang = getLanguagePack(request.cookies.lang);
  const previousPage = request.header('Referer') || '/';
  response.cookie('previousPage', previousPage, { domain: '.impactium.fun', secure: true });
  
  try {
    const loginTemplate = fs.readFileSync('views/login.ejs', 'utf8');
    const body = ejs.render(loginTemplate, lang);

    response.render('template.ejs', {
      body,
      user,
      lang
    });
    
  } catch (err) {
    console.error(err);
    response.redirect('/');
  }
});

app.get('/logout', (request, response) => {
  global.logged.delete(request.ip);
  response.clearCookie('token', { domain: '.impactium.fun' });
  response.clearCookie('token');
  response.redirect('/');
});

app.get('/error', (request, response) => {
  const lang = getLanguagePack(request.cookies.lang);
  response.render('error.ejs', { lang })
});

app.get('/lang/:lang', (request, response) => {
  const newLang = request.params.lang;
  response.cookie('lang', newLang, { domain: '.impactium.fun', secure: true });
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
app.listen(3000, () => { 
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

schedule('0 */6 * * *', async () => {
  await mcs.resourcePack.process();
});
schedule('0 0 * * *', async () => {
  await mcs.resourcePack.process();
});
schedule('*/10 * * * *', async () => {
  await mcs.fetchStats();
});