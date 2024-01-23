const express = require('express');
const { User, log, MinecraftPlayer } = require('../utils');
const router = express.Router();

router.get('/status', (request, response) => {
  response.sendStatus(200);
});

const userMiddleware = async (request, response, next) => {
  if (!request.headers.token)
    return response.sendStatus(401);

  try {
    const user = new User(request.headers.token);
    await user.fetch();

    if (!user._id)
      return response.sendStatus(401);

    request.user = user.send();
    request._user = user;
    next();
  } catch (error) {
    console.log(error);
    response.sendStatus(500);
  }
};

router.use('/*', userMiddleware);

router.get('/user/get', async (request, response) => {
  response.status(200).send(request.user);
});

const playerMiddleware = async (request, response, next) => {
  try {
    const player = new MinecraftPlayer(request.user._id);
    await player.fetch();
    
    if (!player._id)
      return response.sendStatus(401);
    
    request.player = player.serialize();
    request._player = player;

    next();
  } catch (error) {
    console.log(error);
    response.sendStatus(500);
  }
};

router.use('/player', playerMiddleware);

router.get('/player/get', async (request, response) => {
  response.status(200).send(request.player);
});

router.post('/player/register', async (request, response) => {
  response.status(200).send(request.player);
});

router.post('/player/set/nickname', async (request, response) => {
  const status = await request._player.setNickname(request.headers.nickname);
  response.status(status).send(request._player.serialize());
});

router.post('/player/set/password', async (request, response) => {
  const status = await request._player.setPassword(request.headers.password);
  response.status(status).send(request._player.serialize());
});

router.post('/player/set/skin', async (request, response) => {
  response.status(200).send(request.player);
});

router.get('/player/achievements/get', async (request, response) => {
  await request._player.achievements.process();

  response.status(200).send(request._player.serialize());
});

module.exports = router;