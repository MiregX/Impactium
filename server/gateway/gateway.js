const express = require('express');
const { connect } = require('amqplib');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;

let channel;

const createChannel = async () => {
  const connection = await connect('amqp://localhost:5672');
  channel = await connection.createChannel();
};

createChannel();

const rabbitMiddleware = async (req, res, next) => {
  try {
    const replyQueue = await channel.assertQueue('', { exclusive: true });

    channel.publish(
      req.rabbitExchange,
      '*',
      Buffer.from(JSON.stringify({
        path: req.params[0],
        headers: req.headers,
        body: req.body,
      })),
      { replyTo: replyQueue.queue,
        correlationId: req.headers['correlation-id'] || uuidv4() }
    );

    await channel.consume(replyQueue.queue, (message) => {
      const responseData = JSON.parse(message.content.toString());
      res.json(responseData); // Отправляем JSON вместо текста
    }, { noAck: true });
  } catch (error) {
    console.error('Error in rabbitMiddleware:', error);
    res.status(500).send('Internal Server Error');
  }
};

app.use('/api/mcs/*', (req, res, next) => {
  req.rabbitExchange = 'impactium';
  next();
}, rabbitMiddleware);

app.use(['/api/user', '/app/player'], (req, res, next) => {
  req.rabbitExchange = 'account';
  next();
}, rabbitMiddleware);

app.use('/api/oauth2', (req, res, next) => {
  req.rabbitExchange = 'oauth2';
  next();
}, rabbitMiddleware);

app.listen(PORT, () => {
  console.log(`Gateway is running on port ${PORT}`);
});
