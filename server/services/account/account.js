const amqplib = require('amqplib');

class Consumer {
  constructor() {}

  async init() {
    try {
      const conn = await amqplib.connect('amqp://localhost');
      this.ch = await conn.createChannel();
      await this.ch.assertQueue('user');
      await this.ch.assertQueue('player');
      this.userConsumer();
      this.playerConsumer();
      console.log('Connection established and queues asserted.');
    } catch (error) {
      console.error('Error initializing connection:', error);
    }
  }

  userConsumer() {
    this.consumer('user');
  }

  playerConsumer() {
    this.consumer('player');
  }

  consumer(queue) {
    this.ch.consume(queue, async (msg) => {
      try {
        console.log(`Received message from ${queue}:`, msg.content.toString());
        this.ch.sendToQueue(
          msg.properties.replyTo,
          Buffer.from(`${queue} consumer`),
          { correlationId: msg.properties.correlationId }
        );
        console.log(`Sent response for ${queue}`);
      } catch (error) {
        console.error('Error processing message:', error);
      }

      this.ch.ack(msg);
    });
  }
}

const main = new Consumer();
main.init();