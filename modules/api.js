const express = require('express');
const { User, log } = require('../utils');
const router = express.Router();

router.get('/getUser', async (request, response) => {
  
  const token = request.headers.token;
  console.log(token)

  const user = new User(token);
  await user.fetch();
  console.log(user)

  response.status(200).send(user);
});

module.exports = router;