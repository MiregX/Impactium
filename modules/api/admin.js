const express = require('express');
const router = express.Router();

router.get('/status', (request, response) => {
  response.sendStatus(200);
});
module.exports = router;