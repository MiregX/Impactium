const amqplib = require('amqplib');
const { createClient } = require('redis');
const { User } = require('./class/User');
const { Player } = require('./class/Player');

class Request {
  constructor(m) {
    Object.assign(this, m);
    this.parse();
  }

  parse() {
    this.content = JSON.parse(this.content.toString());
    return this.content;
  }
}

class Consumer {
  constructor() {
    this.exchanges = ['user', 'player', 'player.set', 'player.achievements'];
    this.player = new Player();
    this.user = new User();
    this.handlers = {
      user: {
        get: () => this.user.send
      },
      player: {
        get: () => this.player.send,
        set: {
          password: () => this.player.setPassword,
          nickname: () => this.player.setNickname,
          skin: () => this.player.setSkin,
        },
        achievements: {
          get: () => this.player.achievements.process,
          set: () => this.player.achievements.set
        }
      }
    };
  }

  async init() {
    this.redis = createClient();
    const conn = await amqplib.connect('amqp://localhost');
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

      if (!req.content.headers.token) {
        return this.send(req, { error: 401 })
      }

      const { handler, account } = this.getHandler(req.fields);
      if (!account) {
        return this.send(req, { error: 400 })
      }

      await account.fetch(req.content.headers.token);

      const data = typeof handler === 'undefined'
        ? { error: 400 }
        : (typeof handler === 'function'
          ? handler()
          : handler.x()
      );
      this.send(req, await data);
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
    let handler = this.handlers;
    const path = [...fields.exchange.split('.'), ...fields.routingKey.split('.')];
    const account = path[0] === 'user'
      ? this.user
      : (path[0] === 'player'
        ? this.player
        : null);

    for (let key of path) {
      handler = handler[key];
      if (!handler) {
        break;
      }
    }
    return { handler, account };
  }
}

const main = new Consumer();
main.init();