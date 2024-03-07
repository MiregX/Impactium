// mcs.js
const { connect } = require('amqplib');

class McsHandler {
  constructor(channel) {
    this.channel = channel;
  }

  handleRequest(message) {
    try {
      const parsedMessage = JSON.parse(message.content.toString());
      console.log('Handling MCS request:');
      console.log(parsedMessage);

      // Обрабатываем запрос в зависимости от пути
      if (parsedMessage.path === '/status') {
        this.handleStatusRequest(message.properties.replyTo, message.properties.correlationId);
      } else if (parsedMessage.path === '/info') {
        this.handleInfoRequest(message.properties.replyTo, message.properties.correlationId);
      } else {
        console.error('Unknown path:', parsedMessage.path);
      }
    } catch (error) {
      console.error('Error handling MCS request:', error);
    }
  }

  handleStatusRequest(replyQueue, correlationId) {
    // Отправляем ответ с кодом 200
    this.channel.sendToQueue(replyQueue, Buffer.from('Status: OK'), { correlationId });
  }

  handleInfoRequest(replyQueue, correlationId) {
    // Отправляем ответ с объектом информации
    const infoObject = { key: 'value', anotherKey: 'anotherValue' };
    this.channel.sendToQueue(replyQueue, Buffer.from(JSON.stringify(infoObject)), { correlationId });
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

    // Обрабатываем входящие сообщения
    channel.consume(queue.queue, mcsHandler.handleRequest.bind(mcsHandler), { noAck: true });

    console.log('MCS service is running.');
  } catch (error) {
    console.error('Error creating MCS service:', error);
  }
};

runMcsService();
