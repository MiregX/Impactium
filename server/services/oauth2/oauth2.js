import dotenv from 'dotenv';
dotenv.config({
  path: process.env.NODE_ENV !== 'production' ? '../../.env.dev' : '../../.env.prod'
});
import { MongoDB, generateToken } from '../../utils';
import { connect } from 'amqplib';
import { createClient } from 'redis';
import { ObjectId } from 'mongodb';

class Consumer {
  constructor() {
    this.exchanges = ['oauth2'];
    this.handlers = {
      callback: {
        google: () => null,
        discord: () => null,
      }
    }
  }

  handler(func) {
    return (req) => {
      const data = req.body || req.headers;
      return func(data);
    };
  }

  async init() {
    this.redis = createClient();
    const conn = await connect('amqp://localhost');
    this.ch = await conn.createChannel();

    for (let exchange of this.exchanges) {
      await this.ch.assertExchange(exchange, 'topic');
      await this.ch.assertQueue(`${exchange}.*`);
      this.ch.bindQueue(`${exchange}.*`, exchange, '*');
    }

    this.consumer('user.*');
    this.consumer('player.*');
    this.consumer('player.set.*');
    this.consumer('player.achievements.*');

    await this.redis.connect();
  }

  consumer(queue) {
    this.ch.consume(queue, async (msg) => {
      const req = new Request(msg);
      
      console.log(req.content?.headers?.cookie);
      console.log(req.content?.headers?.cookie?.token);
      const token = req.content?.headers?.token || req.content?.headers?.cookie?.token
      if (!token) {
        return this.send(req, { status: 401 })
      }

      const { handler, account } = this.getHandler(req.fields);
      await account.fetch(new ObjectId('6575c31141f1539480230b8a'));
      console.log(account);

      const { status, data = account.send() } = typeof handler === 'undefined'
        ? { status: 400 }
        : (typeof handler === 'function'
          ? await handler(req)
          : await handler.x(req)
      );

      this.send(req, { status, data });
    });
  }

  send(msg, data) {
    this.ch.sendToQueue(
      msg.properties.replyTo,
      Buffer.from(JSON.stringify(data)),
      { correlationId: msg.properties.correlationId }
    );
    this.ch.ack(msg);
  }

  getHandler(fields) {
    const path = [...fields.exchange.split('.'), ...fields.routingKey.split('.')];
    let handler = this.handlers;
    const account = this.accounts[path[0]];

    for (let key of path) {
      handler = handler[key];
      if (!handler) break;
    }

    return { handler, account };
  }
}

const main = new Consumer();
main.init();