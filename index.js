const fs = require('fs');
const ejs = require('ejs');
const cors = require('cors');
const path = require('path');
const https = require('https');
const vhost = require('vhost');
const utils = require('./utils');
const express = require('express');
const telegram = require('./telegram');
const session = require('express-session');
const cookieParser = require('cookie-parser');
// const { updateUserDisplayName } = require('./discord');
const { User, getLanguagePack, log } = require('./utils');
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
app.use('/static', express.static('static', { setHeaders: (response, path) => { response.setHeader('Cache-Control', 'public, max-age=1'); }}));

app.set('view engine', 'ejs');

global.logged = global.logged || new Map();

const options = utils.getLicense();

const govApp = require('./modules/goverment/gov');
app.use(vhost('gov.impactium.fun', govApp));

app.get('/', (request, response) => {
  try {
    const user = new User();
    user.fetch(request.cookies.token).then(() => {
      const lang = getLanguagePack(request.cookies.lang);
      const body = ejs.render(fs.readFileSync('views/index.ejs', 'utf8'), { user, lang, nav });
      
      response.render('template.ejs', { body, user, lang, nav });
    });
  } catch (error) {
    console.log(error, 'r');
    return response.status(500).send('Internal Server Error');
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
    response.render('error.ejs', { code: 500, message: 'Internal Server Error'});
  }
});

app.get('/logout', (request, response) => {
  global.logged.delete(request.ip);
  response.clearCookie('token', { domain: '.impactium.fun' });
  response.redirect('/');
});

app.get('/set-token', (request, response) => {
  if (options.isSuccess) return response.redirect('/');
  response.cookie('token', "321");
  response.redirect('/');
});

app.get('/error', (request, response) => {
  const lang = getLanguagePack(request.cookies.lang);
  response.render('error.ejs', {
    lang, code: request.session.error_code || 500,
    message: request.session.error_message || "Internal Server Error",
    description: request.session.error_description || false
  })
});

app.get('/lang/:lang', (request, response) => {
  const newLang = request.params.lang;
  response.cookie('lang', newLang, { domain: '.impactium.fun', secure: true });
  response.cookie('lang', request.params.lang);
  response.redirect('back');
});

const terminalRouter = require('./modules/terminal');
app.use('/terminal', terminalRouter);

const metrixRouter = require('./modules/metrix');
app.use('/metrix', metrixRouter);

const phpApp = require('./modules/php/index');
app.use('/php', phpApp);

const albionApp = require('./modules/albion/guildpanel');
app.use('/fax', albionApp);

const oauth2 = require('./modules/oauth2');
app.use('/oauth2', oauth2);

app.use((err, req, res, next) => {
  req.session.error_code = 500
  req.session.error_description = err.message
  console.log(err);
  res.redirect('/error');
});

app.use((req, res, next) => {
  req.session.error_code = 404
  req.session.error_message = "Дальше бога нет"
  req.session.error_description = "Искомой страницы не существует"
  res.redirect('/error')
});

const server = https.createServer(options, app)

options.isSuccess
? // Если ключ правильный и сертификат найден
server.listen(80, () => {
  log(`Основной сервер запущен`, 'g');
})
: // Если ключ неправильный или не найден
app.listen(3000, () => { 
  log(`Тестовый сервер запущен`); 
})