const amqplib = require('amqplib');

(async () => {
  const queue = 'tasks';
  const conn = await amqplib.connect('amqp://localhost');

  const ch1 = await conn.createChannel();
  await ch1.assertQueue(queue);

  ch1.consume(queue, async (msg) => {
    if (msg !== null) {
      console.log('Received:', msg.content.toString());

      // Process the message and generate a response
      const response = processMessage(msg.content.toString());

      // Check if replyTo queue is present in the message properties
      if (msg.properties.replyTo) {
        try {
          // Send the response to the replyTo queue
          await ch1.sendToQueue(
            msg.properties.replyTo,
            Buffer.from(JSON.stringify(response)),
            { correlationId: msg.properties.correlationId }
          );
          console.log('Sent response:', response);
        } catch (error) {
          console.error('Error sending response:', error);
        }
      } else {
        console.warn('ReplyTo queue not found in message properties');
      }

      ch1.ack(msg);
    } else {
      console.log('Consumer cancelled by server');
    }
  });
})();

// Replace this function with your actual message processing logic
function processMessage(message) {
  // Implement your processing logic here
  // This function should return the response data
  return { processedData: message };
}