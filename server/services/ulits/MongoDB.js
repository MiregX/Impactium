import mongodb from 'mongodb';
import encrypto from 'crypto';

export class MongoDB {
  constructor() {
    if (MongoDB.instance) return MongoDB.instance;
    MongoDB.instance = this;
    this.init();
  }

  init() {
    this.mongo = new mongodb.MongoClient(process.env.MONGO_LOGIN, {
      serverApi: {
        version: mongodb.ServerApiVersion.v1,
        strict: true
      }
    });
  }

  async getDatabase(collection) {
    try {
      if (!this.mongo)
        this.init();

      return this.mongo.db().collection(collection);
    } catch (error) {
      await this.mongo.connect();
      return await getDatabase(collection);
    }
  }
}

export function generateToken(sumbolsLong) {
  return encrypto.randomBytes(sumbolsLong).toString('hex');
}

export class Request {
  constructor(message) {
    Object.assign(this, message);
    this.parse();
  }

  parse() {
    this.content = JSON.parse(this.content?.toString());
    return this.content;
  }
}