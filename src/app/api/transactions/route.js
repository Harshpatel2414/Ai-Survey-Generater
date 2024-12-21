import { MongoClient } from 'mongodb';
import { NextResponse } from 'next/server';

export const GET = async () => {
  const client = new MongoClient(process.env.MONGO_URI);

  try {
    await client.connect();
    const db = client.db(process.env.DATABASE);
    const transactionCollection = db.collection('Transactions');

    const transactions = await transactionCollection.find().toArray();

    return NextResponse.json({ transactions }, { status: 200 });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  } finally {
    await client.close();
  }
};
