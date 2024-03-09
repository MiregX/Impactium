const express = require('express');
const { connect } = require('amqplib');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;

// gateway
class Gateway {
  constructor() {
    this.channel = null;
  }

  async init() {
    this.queue = 'tasks';
    const conn = await connect('amqp://localhost');
    this.ch = await conn.createChannel();
  }

  async handler(req, res) {
    try {
      const correlationId = uuidv4();
      const data = JSON.stringify({
        path: req.params[0],
        headers: req.headers,
        body: req.body,
        correlationId,
      });

      const { queue: replyQueue } = await this.ch.assertQueue('', { exclusive: true });

      const responsePromise = new Promise((resolve, reject) => {
        this.ch.consume(replyQueue, (msg) => {
          if (msg !== null && msg.properties.correlationId === correlationId) {
            console.log('Received response:', msg.content.toString());
            this.ch.ack(msg);
            resolve(msg.content.toString());
          }
        }, { noAck: false });
      });

      this.ch.sendToQueue(this.queue, Buffer.from(data), {
        replyTo: replyQueue,
        correlationId,
      });

      const responseData = await responsePromise;

      res.send(JSON.parse(responseData));
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  }
}
const gateway = new Gateway();
gateway.init().then(() => {
  app.use('/api/mcs/*', async (req, res) => {
    const data = await gateway.handler(req, res);
    console.log(data);
  });

  app.listen(PORT, () => console.log(`Gateway is running on port ${PORT}`));
});



// app.use(['/api/user', '/app/player'], logRequest, gateway.handler.bind(gateway));
  
// app.use('/api/oauth2', logRequest, gateway.handler.bind(gateway));