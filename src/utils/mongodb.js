import { MongoClient } from 'mongodb';

if (!process.env.MONGO_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGO_URI"');
}

const uri = process.env.MONGO_URI;

let client;

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClient) {
    global._mongoClient = new MongoClient(uri);
  }
  client = global._mongoClient;
} else {
  client = new MongoClient(uri, options);
}

const connectToDatabase = async () => {
  try {
    await client.connect();
    return client.db(process.env.DATABASE);
  } catch (error) {
    console.error('Database connection failed:', error);
    throw new Error('Failed to connect to the database');
  }
};

export default connectToDatabase;
