// mcs.js
const { connect } = require('amqplib');

class McsHandler {
  constructor(channel) {
    this.channel = channel;
  }

  handleRequest(message) {
    try {
      const parsedMessage = JSON.parse(message.content.toString());
      console.log(parsedMessage);

      switch (parsedMessage.path) {
        case 'status':
          this.handleStatusRequest(message.properties);
          break;
          
        case 'info':
          this.handleInfoRequest(message.properties);
          break;
        
        default:
          this.channel.sendToQueue(message.properties.replyTo, Buffer.from('500'), { correlationId: message.properties.correlationId });
          break;
      }
    } catch (error) {
      this.channel.sendToQueue(message.properties.replyTo, Buffer.from('500'), { correlationId: message.properties.correlationId });
    }
  }

  handleStatusRequest({ replyTo, correlationId }) {
    const responseData = { status: 200 };
    this.channel.sendToQueue(replyTo, Buffer.from(JSON.stringify(responseData)), { correlationId });
  }

  handleInfoRequest({ replyTo, correlationId }) {
    const infoObject = { key: 'value', anotherKey: 'anotherValue' };
    this.channel.sendToQueue(replyTo, Buffer.from(JSON.stringify(infoObject)), { correlationId });
  }
}

const runMcsService = async () => {
  try {
    const connection = await connect('amqp://localhost');
    const channel = await connection.createChannel();
    const mcsHandler = new McsHandler(channel);

    // Объявляем обменник и создаем очередь для MCS
    await channel.assertExchange('impactium', 'topic', { durable: true });
    const queue = await channel.assertQueue('mcs_queue', { durable: true });
    channel.bindQueue(queue.queue, 'impactium', '*');

    channel.consume(queue.queue, mcsHandler.handleRequest.bind(mcsHandler), { noAck: true });
  } catch (error) {
    console.error('Error creating MCS service:', error);
  }
};

runMcsService();