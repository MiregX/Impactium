require('dotenv').config();
const unirest = require('unirest');
const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const { getDatabase, generateToken, Referal} = require('../utils');
const { discordClientID, discordRedirectApiUri, discordClientSecret, googleClientID, googleClientSecret } = process.env

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
    console.log(error);
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
      return response.sendStatus(500);
    }

    try {
      userAuthentication({data: user._json, from: "google", referal: request.query.referal}).then(authResult => {
        return response.redirect(`https://impactium.fun/login/callback?token=${authResult.token}&lang=${authResult.lang}`);
      });
    } catch (error) {
      return response.redirect('/');
    }
  })(request, response, next);
});

router.get('/callback/discord', (request, response) => {
  if (!request.query.code) return response.redirect('/');
  let requestPayload = {
    redirect_uri: discordRedirectApiUri,
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
          userAuthentication({data: data.body, from: "discord", referal: request.query.ref}).then(authResult => {
            return response.status(200).send(authResult);
          });
        })
        .catch((error) => {
          console.log(error);
          return response.sendStatus(500);
        });
    })
    .catch((error) => {
      console.log(error);
      return response.sendStatus(500);
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
    
    const avatar = userPayload.picture
      ? userPayload.picture
      : `https://cdn.discordapp.com/avatars/${userPayload.id}/${userPayload.avatar}.png`;

    const userToSave = {
      lastLogin: loginSource,
      token: token,
    }

    userToSave[loginSource] = {
      id: userPayload.sub || userPayload.id,
      email: userPayload.email || undefined,
      avatar: avatar,
      displayName: userPayload.name || userPayload.global_name?.replace(/'/g, '`') || undefined,
      locale: userPayload.locale.split('-')[0] || "en"
    }

    if (userDatabase) {
      Object.assign(userDatabase, userToSave);
    
      await Database.updateOne(
        { _id: userDatabase._id },
        { $set: userDatabase }
      );

      const referal = new Referal(userDatabase._id);
      await referal.fetch();
    } else {
      userToSave.nthRegister = await Database.countDocuments();
      const insertedUser = await Database.insertOne(userToSave);
      const referal = new Referal(insertedUser.insertedId)
      await referal.fetch();
      if (p.referal) {
        await referal.setParent(p.referal);
      }
    }
    return { lang: userToSave[loginSource].locale, token };
  } catch (error) {
    console.log(error);
  }
}

module.exports = router;