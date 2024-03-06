require('dotenv').config({
  path: process.env.NODE_ENV !== 'production' ? './.env.dev' : './.env.prod'
});
const { getLicense, log, ImpactiumServer } = require('./utils');
const session = require('express-session');
const { schedule } = require('node-cron');
const express = require('express');
const https = require('https');
const cors = require('cors');
const next = require('next');
const path = require('path');

const server = next({
  dir: path.join(__dirname, 'client'),
  port: process.env.PORT,
  dev: process.env.NODE_ENV !== 'production',
  hostname: process.env.HOSTNAME
});

const handle = server.getRequestHandler();

const options = getLicense();
const mcs = new ImpactiumServer();

server.prepare().then(async () => {
  const app = express();
  
  app.use(cors());

  app.use(session({
    secret: process.env.DISCORD_SECRET,
    resave: false,
    saveUninitialized: false,
  }));

  app.use('/api', require('./modules/api'));
  app.use('/oauth2', require('./modules/oauth2'));

  app.all('*', (req, res) => {
    handle(req, res)
  });

  if (options.isSuccess) {
    https.createServer(options, app).listen(process.env.PORT, () => {
      log(`Основной сервер запущен`, 'g');
    });
  } else {
    server.listen(process.env.PORT, () => { 
      log(`Тестовый сервер запущен`);
    });
  }

  try {
    await mcs.launch();
    await mcs.updateWhitelist();
    await mcs.fetchStats();
  } catch (error) { console.log(error) }
});

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