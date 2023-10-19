const fs = require('fs');
const ejs = require('ejs');
const path = require('path');
const https = require('https');
const vhost = require('vhost');
const utils = require('./utils');
const express = require('express');
const telegram = require('./telegram');
const session = require('express-session');
const cookieParser = require('cookie-parser');
// const { updateUserDisplayName } = require('./discord');
const { getUserDataByToken, getLanguagePack, log, setStatistics } = require('./utils');
const { discordClientSecret, nav } = JSON.parse(fs.readFileSync('json/codes_and_tokens.json', 'utf8'));

const app = express();

app.use(session({
  secret: discordClientSecret,
  resave: false,
  saveUninitialized: false,
}));

app.use(express.json());
app.use(cookieParser());
app.use('/static', express.static('static', { setHeaders: (response, path) => { response.setHeader('Cache-Control', 'public, max-age=1'); }}));

app.set('view engine', 'ejs');

global.logged = global.logged || new Map();

const options = utils.getLicense();

const albionApp = require('./modules/albion/guildpanel');
app.use(vhost('fax.impactium.fun', albionApp));

app.get('/', (request, response) => {
  try {
    const user = getUserDataByToken(request.cookies.token);
    const lang = getLanguagePack(request.cookies.lang);

    const indexTemplate = fs.readFileSync('views/index.ejs', 'utf8');
    const body = ejs.render(indexTemplate, { user, lang, nav });
    response.render('template.ejs', { body, user, lang, nav });
    setStatistics('mainWebJoins');
    
  } catch (error) {
    console.log(error, 'r');
    return response.status(500).send('Internal Server Error');
  }
});

app.get('/login', (request, response) => {
  const user = getUserDataByToken(request.cookies.token);
  if (user) return response.redirect('/');
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
    response.render('error.ejs', { code: 500, message: 'Internal Server Error'});
  }
});

app.get('/logout', (request, response) => {
  global.logged.delete(request.ip);
  response.clearCookie('token', { domain: '.impactium.fun' });
  response.redirect('/');
  setStatistics('logouts');
});

app.get('/set-token', (request, response) => {
  if (options.isSuccess) return response.redirect('/');
  response.cookie('token', "51f413ca5c3e3d0dbbdadd526a1867e890a52b16e8616338546bbe61bbe1b79218d804eea71df4ad235963b9d4fa72f91dbf839ed02fec9c959bb7335fd545af");
  response.redirect('/');
});

app.get('/error', (request, response) => {
  const lang = getLanguagePack(request.cookies.lang);
  response.render('error.ejs', { lang, code: 500, message: request.session.error_message || "Internal Server Error"})
});

app.get('/lang/:lang', (request, response) => {
  const newLang = request.params.lang;
  response.cookie('lang', newLang, { domain: '.impactium.fun', secure: true });
  response.cookie('lang', request.params.lang);
  response.redirect('back');
  setStatistics(`lang${newLang}`);
});

const terminalRouter = require('./modules/terminal');
app.use('/terminal', terminalRouter);

const metrixRouter = require('./modules/metrix');
app.use('/metrix', metrixRouter);

const phpApp = require('./modules/php/index');
app.use('/php', phpApp);

const oauth2 = require('./modules/oauth2');
app.use('/oauth2', oauth2);

const server = https.createServer(options, app)

options.isSuccess
? // Если ключ правильный и сертификат найден
server.listen(80, () => {
  log(`Основной сервер запущен`, 'g');
})
: // Если ключ неправильный или не найден
app.listen(3000, () => { 
  log(`Тестовый сервер запущен`, 'y'); 
})