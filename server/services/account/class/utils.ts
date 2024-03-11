import { MongoClient, ServerApiVersion } from 'mongodb';
import encrypto from 'crypto';

const mongo = new MongoClient(process.env.MONGO_LOGIN as string, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true
  }
});

export function generateToken(sumbolsLong) {
  return encrypto.randomBytes(sumbolsLong).toString('hex');
}

export async function getDatabase(collection: string) {
  try {
    return mongo.db().collection(collection);
  } catch (error) {
    await mongo.connect();
    return await getDatabase(collection);
  }
}