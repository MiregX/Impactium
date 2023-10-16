const fs = require('fs');
const ejs = require('ejs');
const path = require('path');
const https = require('https');
const vhost = require('vhost');
const utils = require('./utils');
const express = require('express');
const unirest = require('unirest');
const telegram = require('./telegram');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const { OAuth2Client } = require('google-auth-library');
// const { updateUserDisplayName } = require('./discord');
const { getUserDataByToken, getLanguagePack, userAuthentication, log, setStatistics } = require('./utils');
const { discordClientID, discordRedirectUri, discordClientSecret, nav, googleClientID, googleRedirectUri, googleClientSecret } = JSON.parse(fs.readFileSync('json/codes_and_tokens.json', 'utf8'));

const app = express();

app.use(session({
  secret: discordClientSecret,
  resave: false,
  saveUninitialized: false,
}));

app.use(express.json());

app.use(cookieParser());
app.set('view engine', 'ejs');
app.use('/static', express.static('static', { setHeaders: (response, path) => { response.setHeader('Cache-Control', 'public, max-age=1'); }}));

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
    log(error, 'r');
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
    return response.render('error.ejs', { code: 500, message: 'Internal Server Error'});
  }
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

const passport = require('passport');
app.use(passport.initialize());
app.use(passport.session());
const GoogleStrategy = require('passport-google-oauth2').Strategy;

passport.use(new GoogleStrategy({
  clientID: googleClientID,
  clientSecret: googleClientSecret,
  callbackURL: `https://impactium.fun/oauth2/callback/google`,
  scope: ['https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile'],
}, async (accessToken, refreshToken, profile, done) => {
  done(null, profile);
}));

app.get('/oauth2/login/google', passport.authenticate('google'));

app.get('/oauth2/callback/google', passport.authenticate('google', {
  successRedirect: '/',
  failureRedirect: '/login',
}), (request, response) => {
  const authResult = userAuthentication({data: request.user._json, from: "google"});
  log(authResult)
  response.cookie('token', authResult.token, { domain: '.impactium.fun', secure: true });
  response.cookie('lang', authResult.lang, { domain: '.impactium.fun', secure: true });

  const previousPage = request.cookies.previousPage || '/';
  response.clearCookie('previousPage', { domain: '.impactium.fun' });
  response.redirect(previousPage);
});

app.get('/oauth2/login/discord', (request, response) => {
  if (request.query.code) {
    let requestPayload = {
      redirect_uri: discordRedirectUri,
      client_id: discordClientID,
      grant_type: "authorization_code",
      client_secret: discordClientSecret,
      code: request.query.code
    };

    unirest.post("https://discordapp.com/api/oauth2/token")
      .send(requestPayload)
      .headers({ "Content-Type": 'application/x-www-form-urlencoded', "User-Agent": 'DiscordBot' })
      .then((data) => {
        unirest.get("https://discordapp.com/api/users/@me")
          .headers({ "Authorization": `${data.body.token_type} ${data.body.access_token}` })
          .then((data) => {
            const authResult = userAuthentication({data: data.body, from: "discord"});
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
    response.redirect('https://discord.com/api/oauth2/authorize?client_id=1123714909356687360&redirect_uri=https%3A%2F%2Fimpactium.fun%2Foauth2%2Flogin%2Fdiscord&response_type=code&scope=identify%20email');
  }
});