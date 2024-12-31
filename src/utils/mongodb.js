import { MongoClient } from 'mongodb';

if (!process.env.MONGO_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGO_URI"');
}

const uri = process.env.MONGO_URI;
const options = {
  useNewUrlParser: true, // Ensures URL parser is the latest
  useUnifiedTopology: true, // Makes connection behavior more consistent
};

let client;

if (process.env.NODE_ENV === 'development') {
  // In development, use a global client to avoid creating a new connection on every request
  if (!global._mongoClient) {
    global._mongoClient = new MongoClient(uri, options);
  }
  client = global._mongoClient;
} else {
  // In production, create a new client instance with the connection options
  client = new MongoClient(uri, options);
}

const connectToDatabase = async () => {
  try {
    await client.connect();
    console.log('Database connected successfully');
    return client.db(process.env.DATABASE);
  } catch (error) {
    console.error('Database connection failed:', error);
    throw new Error('Failed to connect to the database');
  }
};

export default connectToDatabase;
