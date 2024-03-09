const amqplib = require('amqplib');

(async () => {
  const queue = 'tasks';
  const conn = await amqplib.connect('amqp://localhost');

  const ch = await conn.createChannel();
  await ch.assertQueue(queue);

  ch.consume(queue, async (msg) => {
    if (msg !== null) {
      console.log('Received new req');

      const response = msg.content.toString();

      if (!msg.properties.replyTo) return;
      
      try {
        ch.sendToQueue(
          msg.properties.replyTo,
          Buffer.from(JSON.stringify({
            status: 200,
            capacity: '16%'
          })),
          { correlationId: msg.properties.correlationId }
        );
        console.log('Sent back');
      } catch (error) {
        console.error('Error sending response:', error);
      }

      ch.ack(msg);
    } else {
      console.log('Consumer cancelled by server');
    }
  });
})();