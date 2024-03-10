const amqplib = require('amqplib');

class ImpactiumServerConsumer {
  constructor() {}

  async init() {
    const conn = await amqplib.connect('amqp://localhost');
    this.ch = await conn.createChannel();
    await this.ch.assertQueue('mcs');

    
    this.ch.consume('mcs', async (msg) => {
      try {
        this.ch.sendToQueue(
          msg.properties.replyTo,
          Buffer.from(JSON.stringify({
            status: 200,
            capacity: '16%'
          })),
          { correlationId: msg.properties.correlationId }
        );
      } catch (error) {
        console.error(error);
      }

      this.ch.ack(msg);
    });
  }
}

const mcs = new ImpactiumServerConsumer();
mcs.init();