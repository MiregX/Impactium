const amqplib = require('amqplib');
const { createClient } = require('redis');

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
    this.handlers = {
      user: {
        get: () => 'Игрок база'
      },
      player: {
        get: () => 'Какой то пользователь',
        set: {
          password: () => "setPassword()",
          nickname: () => "setNickname()",
          skin: () => "setSkin()",
        },
        achievements: {
          get: () => 'Какие-то ачивки',
          set: () => 'Поставили ачивку'
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
    this.consumer('user.set.*');
    this.consumer('player.*');
    this.consumer('player.achievements.*');

    await this.redis.connect();
  }

  consumer(queue) {
    this.ch.consume(queue, async (msg) => {
      const req = new Request(msg);
  
      let handler = this.handlers;
      console.log([...req.fields.exchange.split('.'), ...req.fields.routingKey.split('.')])
      for (let key of [...req.fields.exchange.split('.'), ...req.fields.routingKey.split('.')]) {
        console.log(key);
        handler = handler[key];
        console.log('Handler: ', handler);
        if (!handler) {
          break;
        }
      }
      
      const data = typeof handler === 'undefined'
        ? {error: 400}
        : (typeof handler === 'function'
          ? handler()
          : handler.x()
      );
      this.send(msg, data);
  
      this.ch.ack(msg);
    });
  }

  send(msg, data) {
    this.ch.sendToQueue(
      msg.properties.replyTo,
      Buffer.from(JSON.stringify(data)),
      { correlationId: msg.properties.correlationId }
    );
  }
}

const main = new Consumer();
main.init();