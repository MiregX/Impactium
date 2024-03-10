const express = require('express');
const { connect } = require('amqplib');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;

// gateway
class Gateway {
  constructor() {
    this.pendingRequests = new Map();
  }

  async init() {
    const conn = await connect('amqp://localhost');
    this.ch = await conn.createChannel();
    this.replyQueue = await this.ch.assertQueue('', { exclusive: true });

    this.ch.consume(this.replyQueue.queue, (msg) => {
      const correlationId = msg.properties.correlationId;
      if (this.pendingRequests.has(correlationId)) {
        const { resolve, timer } = this.pendingRequests.get(correlationId);
        clearTimeout(timer);
        this.ch.ack(msg);
        resolve(msg.content.toString());
        this.pendingRequests.delete(correlationId);
      } else {
        console.log('Unexpected message received');
      }
    });
  }

  async handler(req, res) {
    try {
      const consumer = req.params[0].split('/')[0];
      console.log(consumer);

      const correlationId = uuidv4();
      const { headers, body } = req;
      const data = JSON.stringify({
        headers,
        body,
        correlationId,
      });

      const timeout = 15000;
      const responsePromise = new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
          this.pendingRequests.delete(correlationId);
          reject(new Error('Response timeout'));
        }, timeout);

        this.pendingRequests.set(correlationId, { resolve, timer });
      });

      this.ch.sendToQueue(consumer, Buffer.from(data), {
        replyTo: this.replyQueue.queue,
        correlationId,
      });

      const responseData = await responsePromise;
      try {
        res.send(JSON.parse(responseData));
      } catch (error) {
        res.send(responseData)
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  }
}

const gateway = new Gateway();
gateway.init().then(() => {
  app.use('/api/*', async (req, res) => {
    await gateway.handler(req, res);
  });

  app.listen(PORT, () => console.log(`Gateway is running on port ${PORT}`));
});