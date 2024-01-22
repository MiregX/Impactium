const express = require('express');
const { User, log, MinecraftPlayer } = require('../utils');
const router = express.Router();

let count = 0

router.get('/user/get', async (request, response) => {
  count++;
  log(count, 'r')
  const user = new User(request.headers.token);
  await user.fetch();

  response.status(200).send(user.send());
});

router.get('/player/get', async (request, response) => {
  if (!request.headers.token || typeof request.headers.token !== 'string')
    return response.sendStatus(401);
  
  const user = new User(request.headers.token)
  await user.fetch();
  if (!user._id)
    return response.sendStatus(402);

  const player = new MinecraftPlayer(user._id);
  await player.fetch();
  if (!player._id)
    return response.sendStatus(403);
  
  response.status(200).send(player.serialize());
});

router.get('/player/achievements/get', async (request, response) => {
  count++;
  log(count, 'r')
  const player = new MinecraftPlayer(request.headers.id);
  await player.fetch();
  await player.achievements.process();

  response.status(200).send(player.serialize());
});

module.exports = router;