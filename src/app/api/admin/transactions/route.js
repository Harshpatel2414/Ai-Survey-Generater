export const maxDuration = 30;
import { NextResponse } from 'next/server';
import connectToDatabase from '@/utils/mongodb';

export const GET = async () => {
  
  try {
    let db = await connectToDatabase();
    const transactionCollection = db.collection('Transactions');

    const transactions = await transactionCollection
      .find()
      .sort({ transactionDate: -1 })
      .toArray();

    return NextResponse.json(transactions , { status: 200 });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
};
