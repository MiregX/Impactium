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
// const { updateUserDisplayName } = require('./discord');
const { User, ImpactiumServer, MinecraftPlayer, getLanguagePack, log } = require('./utils');
const { discordClientSecret, nav } = JSON.parse(fs.readFileSync('json/codes_and_tokens.json', 'utf8'));

const app = express();

app.use(session({
  secret: discordClientSecret,
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
  response.redirect('back');
});

const terminalRouter = require('./modules/terminal');
app.use('/terminal', terminalRouter);

const metrixRouter = require('./modules/metrix');
app.use('/metrix', metrixRouter);

const phpApp = require('./modules/php/index');
app.use('/php', phpApp);

const meApp = require('./modules/me');
app.use('/me', meApp);

const albionApp = require('./modules/albion/guildpanel');
app.use('/fax', albionApp);

const oauth2 = require('./modules/oauth2');
app.use('/oauth2', oauth2);

app.use((err, request, response, next) => {
});

app.use((req, res, next) => {
  res.redirect('/error')
});

const server = https.createServer(options, app)

options.isSuccess
? // Если ключ правильный и сертификат найден
server.listen(80, async () => {
  log(`Основной сервер запущен`, 'g');
  mcs.launch()
  try {
    await mcs.fetchWhitelist();
    await mcs.fetchResoursePackIcons();
    await mcs.processResoursePackIcons();
  } catch (error) {
    console.log(error)
  }
})
: // Если ключ неправильный или не найден
app.listen(3000, () => { 
  log(`Тестовый сервер запущен`); 
})

schedule('0 */6 * * *', async () => {
  await mcs.processResoursePackIcons();
});