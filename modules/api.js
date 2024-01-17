const express = require('express');
const { User, log } = require('../utils');
const router = express.Router();

router.get('/getUser', async (request, response) => {
  const user = new User(request.headers.token);
  await user.fetch();

  response.status(200).send(user.send());
});

module.exports = router;