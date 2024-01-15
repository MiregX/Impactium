const express = require('express');
const { User, log } = require('../utils');
const router = express.Router();

router.get('/getUser', async (request, response) => {
  log(request.headers, 'g');
  
  const token = request.headers.Authorization;

  const user = new User(token);
  await user.fetch();

  response.status(200).send(user);
});

module.exports = router;