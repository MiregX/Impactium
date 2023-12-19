require('dotenv').config();
const fs = require('fs');
const unirest = require('unirest');
const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const { getDatabase, generateToken } = require('../utils');
const { discordClientID, discordRedirectUri, discordClientSecret, googleClientID, googleRedirectUri, googleClientSecret } = process.env

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
  try {
    done(null, profile)
  } catch (error) {
    done(error)
  }
}));

// router.use((err, req, res, next) => {
//   res.redirect('https://impactium.fun/error');
// });

router.get('/login/google', passport.authenticate('google'));

router.get('/callback/google', (request, response, next) => {
  passport.authenticate('google', (err, user, info) => {
    if (err) {
      request.session.error_description = "Нам не удалось прочитать ваш ключ. Try again."
      return next(err);
    }

    try {
      userAuthentication({data: user._json, from: "discord"}).then(authResult => {
        response.cookie('token', authResult.token, { domain: '.impactium.fun', secure: true, maxAge: 31536000000 });
        response.cookie('lang', authResult.lang, { domain: '.impactium.fun', secure: true, maxAge: 31536000000 });
        response.redirect(request.cookies.previousPage || '/');
      });
    } catch (error) {
      next(error);
    }
  })(request, response, next);
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
          userAuthentication({data: data.body, from: "discord"}).then(authResult => {
            response.cookie('token', authResult.token, { domain: '.impactium.fun', secure: true, maxAge: 31536000000 });
            response.cookie('lang', authResult.lang, { domain: '.impactium.fun', secure: true, maxAge: 31536000000 });
            response.redirect(request.cookies.previousPage || '/');
          });
        })
        .catch((error) => {
          console.log(error);
          response.redirect('/');
        });
    })
    .catch((error) => {
      console.log(error);
      response.redirect('/');
    });
});

async function userAuthentication(p) {
  const loginSource = p.from;
  const userPayload = p.data;
  try {
    if (userPayload.error || userPayload.message) return { error: "Error during authorization" };

    const token = generateToken(64);
    const Database = await getDatabase("users");
    let userDatabase;
    
    if (userPayload.email) {
      userDatabase = await Database.findOne({
        $or: [
          { [loginSource + ".email"]: userPayload.email },
          { "google.email": userPayload.email },
          { "discord.email": userPayload.email }
        ]
      });
    } else {
      userDatabase = await Database.findOne({
        $or: [
          { [loginSource + ".id"]: userPayload.sub || userPayload.id },
          { "google.id": userPayload.sub },
          { "discord.id": userPayload.id }
        ]
      });
    }
    
    let avatar = undefined;

    if (userPayload.picture) {
      avatar = userPayload.picture
    } else if (userPayload.avatar) {
      avatar = `https://cdn.discordapp.com/avatars/${userPayload.id}/${userPayload.avatar}.png`
    }

    const userToSave = {
      lastLogin: loginSource,
      token: token,
    }

    userToSave[loginSource] = {
      id: userPayload.sub || userPayload.id,
      email: userPayload.email || undefined,
      avatar: avatar,
      displayName: userPayload.name || userPayload.global_name.replace(/'/g, '`') || undefined,
      locale: userPayload.locale || "en"
    }

    if (userDatabase) {
      Object.assign(userDatabase, userToSave);
    
      await Database.updateOne(
        { _id: userDatabase._id },
        { $set: userDatabase }
      );
    } else {
      userToSave.nthRegister = await Database.countDocuments();
      await Database.insertOne(userToSave);
    }
    return { lang: userToSave[loginSource].locale, token };
  } catch (error) {
    console.log(error);
  }
}

module.exports = router;