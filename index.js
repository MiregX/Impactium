const fs = require('fs');
const ejs = require('ejs');
const path = require('path');
const https = require('https');
const vhost = require('vhost');
const utils = require('./utils');
const express = require('express');
const unirest = require('unirest');
const telegram = require('./telegram');
const cookieParser = require('cookie-parser');
// const { updateUserDisplayName } = require('./discord');
const { getUserDataByToken, getLanguagePack, userAuthentication, log, setStatistics } = require('./utils');
const { clientID, redirect_uri, clientSecret, nav } = JSON.parse(fs.readFileSync('json/codes_and_tokens.json', 'utf8'));

const app = express();

app.use(express.json());

app.use(cookieParser());
app.set('view engine', 'ejs');
app.use('/static', express.static('static', { setHeaders: (response, path) => { response.setHeader('Cache-Control', 'public, max-age=1'); }}));

global.logged = global.logged || new Map();

const options = utils.getLicense();

const albionApp = require('./modules/albion/guildpanel');
app.use(vhost('fax.impactium.fun', albionApp));

app.get('/', (request, response) => {
  if (request.query.code) {
    let requestPayload = {
      redirect_uri,
      client_id: clientID,
      grant_type: "authorization_code",
      client_secret: clientSecret,
      code: request.query.code
    };

    unirest.post("https://discordapp.com/api/oauth2/token")
      .send(requestPayload)
      .headers({ "Content-Type": 'application/x-www-form-urlencoded', "User-Agent": 'DiscordBot' })
      .then((data) => {
        unirest.get("https://discordapp.com/api/users/@me")
          .headers({ "Authorization": `${data.body.token_type} ${data.body.access_token}` })
          .then((data) => {
            const authResult = userAuthentication(data);
            // updateUserDisplayName();

            response.cookie('token', authResult.token, { domain: '.impactium.fun', secure: true });
            response.cookie('lang', authResult.lang, { domain: '.impactium.fun', secure: true });

            const previousPage = request.cookies.previousPage || '/';
            response.clearCookie('previousPage', { domain: '.impactium.fun' });
            response.redirect(previousPage);
            setStatistics('logins');
          })
          .catch((error) => {
            response.redirect('/logout');
            log(error);
          });
      })
      .catch((error) => {
        response.redirect('/logout');
        log(error);
      });
  } else {
    try {
      const user = getUserDataByToken(request.cookies.token);
      const lang = getLanguagePack(request.cookies.lang);
      setStatistics('mainWebJoins');

      const indexData = {
        user,
        lang,
        nav
      }
  
      const indexTemplate = fs.readFileSync('views/index.ejs', 'utf8');
      const body = ejs.render(indexTemplate, indexData);
  
      response.render('template.ejs', {
        body,
        user,
        lang,
        nav
      });
      
    } catch (err) {
      console.error(err);
      return response.status(500).send('Internal Server Error');
    }
  }
});

app.get('/login', (request, response) => {
  const previousPage = request.header('Referer') || '/';
  response.cookie('previousPage', previousPage, { domain: '.impactium.fun', secure: true });
  response.redirect('https://discord.com/api/oauth2/authorize?client_id=1123714909356687360&redirect_uri=https%3A%2F%2Fimpactium.fun%2F&response_type=code&scope=identify');
});

app.get('/logout', (request, response) => {
  global.logged.delete(request.ip);
  response.clearCookie('token', { domain: '.impactium.fun' });
  response.redirect('/');
  setStatistics('logouts');
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