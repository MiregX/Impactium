require('dotenv').config({
  path: process.env.NODE_ENV !== 'production' ? '../.env.dev' : '../.env.prod'
});
const express = require('express');
const amqplib = require('amqplib');
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');
const next = require('next');
const path = require('path');

const https = require('https');



const app = express();
app.use(express.json());

class Gateway {
  constructor() {
    this.pendingRequests = new Map();
    this.exchanges = ['mcs', 'player', 'player.set', 'player.achievements', 'user'];
  }

  async init() {
    const conn = await amqplib.connect('amqp://localhost');
    this.ch = await conn.createChannel();
    this.replyQueue = await this.ch.assertQueue('', { exclusive: true });

    this.ch.consume(this.replyQueue.queue, (msg) => {
      const correlationId = msg.properties.correlationId;
      const { resolve, timer } = this.pendingRequests.get(correlationId);
      clearTimeout(timer);
      this.ch.ack(msg);
      resolve(msg.content.toString());
      this.pendingRequests.delete(correlationId);
    });

    for (let exchange of this.exchanges) {
      this.ch.assertExchange(exchange, 'topic');
      this.ch.assertQueue(`${exchange}`);
      this.ch.bindQueue(`${exchange}`, exchange, '#');
    }
  }

  async handler(req, res) {
    try {
      const path = req.path.slice(1).split('/');
      let consumer = this.exchanges.find(exchange => path[0].startsWith(exchange.split('.')[0]));
      if (consumer) {
        path.shift();
      } else {
        consumer = path.shift();
      }
      const correlationId = uuidv4();
      const data = JSON.stringify({
        headers: req.headers,
        body: req.body,
        correlationId
      });

      this.pendingRequests.set(correlationId, {
        resolve: null,
        timer: setTimeout(() => {
          this.pendingRequests.delete(correlationId);
          res.sendStatus(408);
        }, 5000),
      });

      this.ch.publish(consumer, path.join('.'), Buffer.from(data), {
        replyTo: this.replyQueue.queue,
        correlationId,
      });

      const responseData = await new Promise((resolve) => {
        this.pendingRequests.get(correlationId).resolve = resolve;
      });

      try {
        const data = JSON.parse(responseData);
        data.error ? res.sendStatus(data.error) : res.send(data);
      } catch (error) {
        res.send(responseData);
      }
    } catch (error) {
      console.log(error)
      res.sendStatus(500);
    }
  }
}

function getLicense() {
  try {
    const path = 'C:\\Users\\Mark\\';
    const cert = fs.readFileSync(path + 'cert.pem', 'utf8');
    const key = fs.readFileSync(path + 'key.pem', 'utf8');

    return { isSuccess: true, cert, key };
  } catch (error) {
    return { isSuccess: false };
  }
}

const options = getLicense();

const server = next({
  dir: path.join(__dirname, '..', '..', 'client'),
  port: process.env.PORT,
  dev: process.env.NODE_ENV !== 'production',
  hostname: process.env.HOSTNAME
});

const handle = server.getRequestHandler();

server.prepare().then(async () => {
  const gateway = new Gateway();
  await gateway.init();

  const app = express();
  app.use(cors());

  app.use(['/api', '/api/*'], async (req, res) => {
    await gateway.handler(req, res);
  });
  
  app.all('*', (req, res) => {
    handle(req, res)
  });

  if (options.isSuccess && process.env.NODE_ENV === 'production') {
    https.createServer(options, app).listen(process.env.PORT, () => {
      console.log(`Основной сервер запущен`, 'g');
    });

  } else {
    app.listen(process.env.PORT, () => { 
      console.log(`Тестовый сервер запущен`);
    });

  }
});
