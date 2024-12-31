export const maxDuration = 30;
import { NextResponse } from 'next/server';
import connectToDatabase from '@/utils/mongodb';

export const GET = async (req, { params }) => {

  try {
    const { id } = await params;
    let db = await connectToDatabase();
    const transactionCollection = db.collection('Transactions');

    // Find transactions for the given userId
    const transactions = await transactionCollection
      .find({ userId: id })
      .sort({ transactionDate: -1 })
      .toArray();

    return NextResponse.json({ transactions: transactions || [] }, { status: 200 });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
};
