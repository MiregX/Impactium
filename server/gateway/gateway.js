const express = require('express');
const { connect } = require('amqplib');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;

class Gateway {
  constructor() {
    this.channel = null;
    this.replyQueue = ''; // Add a property to store the reply queue name
  }

  async init() {
    this.queue = 'tasks';
    const conn = await connect('amqp://localhost');
    this.ch = await conn.createChannel();

    // Create a temporary exclusive queue for receiving responses
    const { queue: replyQueue } = await this.ch.assertQueue('', { exclusive: true });
    this.replyQueue = replyQueue;
  }

  async handler(req, res, next) {
    const correlationId = uuidv4();

    try {
      const data = JSON.stringify({
        path: req.params[0],
        headers: req.headers,
        body: req.body,
        correlationId,
      });

      this.ch.sendToQueue(
        this.queue,
        Buffer.from(data),
        { replyTo: this.replyQueue, correlationId }
      );

      this.ch.consume(this.replyQueue, (msg) => {
        if (msg !== null) {
          console.log('Received response:', msg.content.toString());
          // Send the response to the client (replace with your logic)
          res.json(JSON.parse(msg.content.toString()));
          ch1.ack(msg);
        }
      });

      // Wait for a response within a timeout (optional)
      const timeout = setTimeout(() => {
        res.status(500).send('Timeout waiting for response');
      }, 5000);

      res.on('finish', () => clearTimeout(timeout));
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  }
}

const gateway = new Gateway();
gateway.init().then(() => {
  app.use('/api/mcs/*', (req, res, next) => {
    console.log("Пришёл новый запрос на путь: ", '/api/mcs/');
    next();
  }, gateway.handler.bind(gateway));
  
  app.use(['/api/user', '/app/player'], (req, res, next) => {
    req.rabbitExchange = 'account';
    next();
  }, gateway.handler.bind(gateway));
  
  app.use('/api/oauth2', (req, res, next) => {
    req.rabbitExchange = 'oauth2';
    next();
  }, gateway.handler.bind(gateway));
  
  app.listen(PORT, () => {
    console.log(`Gateway is running on port ${PORT}`);
  });
});