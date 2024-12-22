export const maxDuration = 30;
import { MongoClient } from 'mongodb';
import { NextResponse } from 'next/server';

export const GET = async (req, { params }) => {
  const client = new MongoClient(process.env.MONGO_URI);

  try {
    const { id } = params; 
    await client.connect();
    const db = client.db(process.env.DATABASE);
    const transactionCollection = db.collection('Transactions');

    // Find transactions for the given userId
    const transactions = await transactionCollection.find({ userId: id }).toArray();
    
    return NextResponse.json({ transactions: transactions || [] }, { status: 200 });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  } finally {
    await client.close();
  }
};
