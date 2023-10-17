const fs = require('fs');
const unirest = require('unirest');
const express = require('express');
const passport = require('passport');
const { userAuthentication, log } = require('../utils');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const { discordClientID, discordRedirectUri, discordClientSecret, googleClientID, googleRedirectUri, googleClientSecret } = JSON.parse(fs.readFileSync('json/codes_and_tokens.json', 'utf8'));

const router = express.Router();

router.use(passport.initialize());
router.use(passport.session());

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

passport.use(new GoogleStrategy({
  clientID: googleClientID,
  clientSecret: googleClientSecret,
  callbackURL: `https://impactium.fun/oauth2/callback/google`,
  scope: ['https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile'],
}, async (accessToken, refreshToken, profile, done) => {
  done(null, profile);
}));

router.get('/login/google', passport.authenticate('google'));

router.get('/callback/google', passport.authenticate('google'), (request, response) => {
  try {
    const authResult = userAuthentication({data: request.user._json, from: "google"});
    response.cookie('token', authResult.token, { domain: '.impactium.fun', secure: true });
    response.cookie('lang', authResult.lang, { domain: '.impactium.fun', secure: true });

    const previousPage = request.cookies.previousPage || '/';
    response.redirect(previousPage);
  } catch (error) {
    request.session.error_message = error.name;
    response.redirect('https://impactium.fun/error');
  }
});

router.get('/login/discord', (request, response) => {
  response.redirect('https://discord.com/api/oauth2/authorize?client_id=1123714909356687360&redirect_uri=https%3A%2F%2Fimpactium.fun%2Foauth2%2Fcallback%2Fdiscord&response_type=code&scope=identify%20email');
});

router.get('/callback/discord', (request, response) => {
  if (!request.query.code) return response.redirect('/');
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
          response.cookie('token', authResult.token, { domain: '.impactium.fun', secure: true });
          response.cookie('lang', authResult.lang, { domain: '.impactium.fun', secure: true });

          const previousPage = request.cookies.previousPage || '/';
          return response.redirect(previousPage);
        })
        .catch((error) => {
          console.log(error);
          request.session.error_message = error.name;
          response.redirect('https://impactium.fun/error');
        });
    })
    .catch((error) => {
      console.log(error);
      request.session.error_message = error.name;
      response.redirect('https://impactium.fun/error');
    });
});

module.exports = router;