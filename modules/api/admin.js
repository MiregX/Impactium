const express = require('express');
const router = express.Router();
const { ImpactiumServer } = require('../../utils');

router.use('/*', async (request, response, next) => {
  try {
    if (!request.user.isCreator)
      return response.sendStatus(401);

    request.server = new ImpactiumServer();

    next();
  } catch (error) {
    console.log(error);
    response.sendStatus(500);
  }
});

router.get('/status', (request, response) => {
  response.status(200).send(200);
});

module.exports = router;