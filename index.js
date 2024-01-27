require('dotenv').config();
const cors = require('cors');
const path = require('path');
const https = require('https');
const express = require('express');
const session = require('express-session');
const { schedule } = require('node-cron');
const { getLicense, log, ImpactiumServer } = require('./utils');

const app = express();

app.use(cors());
app.use(session({
  secret: process.env.discordClientSecret,
  resave: false,
  saveUninitialized: false,
}));

const mcs = new ImpactiumServer();

const middleware = async (request, response, next) => {
  console.log(request.url);
  next();
};

app.use(middleware);

app.use('/static', express.static(path.join(__dirname, 'client/build/static')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

app.use('/api', require('./modules/api'));
app.use('/oauth2', require('./modules/oauth2'));

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

const options = getLicense()
if (options.isSuccess) {
  https.createServer(options, app)
  .listen(80, async () => {
    log(`Основной сервер запущен`, 'g');
    try {
      mcs.launch();
    } catch (error) { log(error) }
  })
} else {
  app.listen(3001, () => { 
    log(`Тестовый сервер запущен`);
  })

}

schedule('0 */6 * * *', async () => {
  await mcs.resourcePack.process();
});
schedule('0 0 * * *', async () => {
  await mcs.resourcePack.process();
  await mcs.referals.init();
});
schedule('*/10 * * * *', async () => {
  mcs.command('list', true);
  await mcs.fetchStats();
});