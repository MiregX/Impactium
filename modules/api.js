const express = require('express');
const { User, log } = require('../utils');
const router = express.Router();

let count = 0

const oauth2 = require('./api/oauth2');
router.use('/oauth2', oauth2);

router.get('/getUser', async (request, response) => {
  count++;
  log(count, 'r')
  const user = new User(request.headers.token);
  await user.fetch();

  response.status(200).send(user.send());
});

module.exports = router;