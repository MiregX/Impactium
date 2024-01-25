const express = require('express');
const { log, Player, User } = require('../utils');
const router = express.Router();

router.get('/status', (request, response) => {
  response.sendStatus(200);
});

router.get('/gianmarko', (request, response) => {
  response.status(200).send({
    nome: "Gianmarko",
    age: 18,
    cognome: "Bonuglia"
  });
});

const userMiddleware = async (request, response, next) => {
  if (!request.headers.token)
    return response.sendStatus(401);

  try {
    request.user = new User(request.headers.token);
    await request.user.fetch();

    if (!request.user._id)
      return response.sendStatus(401);

    next();
  } catch (error) {
    console.log(error);
    response.sendStatus(500);
  }
};

router.use('/*', userMiddleware);

router.get('/user/get', async (request, response) => {
  response.status(200).send(request.user.send());
});

const playerMiddleware = async (request, response, next) => {
  try {
    request.player = new Player(request.user._id);
    await request.player.fetch();
    
    if (!request.player._id)
      return response.sendStatus(401);

    next();
  } catch (error) {
    console.log(error);
    response.sendStatus(500);
  }
};

router.use('/player', playerMiddleware);

router.get('/player/get', async (request, response) => {
  response.status(200).send(request.player.send());
});

router.post('/player/register', async (request, response) => {
  const status = await request.player.register();
  response.status(status).send(request.player.send());
});

router.post('/player/set/achievement', async (request, response) => {
  const status = await request.player.achievements.use(request.headers.achievement);
  response.status(200).send(request.player.send());
});

router.post('/player/set/nickname', async (request, response) => {
  const status = await request.player.setNickname(request.headers.nickname);
  response.status(status).send(request.player.send());
});

router.post('/player/set/password', async (request, response) => {
  const status = await request.player.setPassword(request.headers.password);
  response.status(status).send(request.player.send());
});

router.post('/player/set/skin', async (request, response) => {
  response.status(200).send(request.player.send());
});

router.get('/player/achievements/get', async (request, response) => {
  await request.player.achievements.process();
  response.status(200).send(request.player.send());
});

module.exports = router;