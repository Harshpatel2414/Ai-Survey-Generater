export const maxDuration = 30;
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import connectToDatabase from '@/utils/mongodb';

export const GET = async (req) => {
  try {
    const db = await connectToDatabase();
    const collection = db.collection('Users');

    const users = await collection.find().project({ username: 1, email: 1, _id: 1, walletAmount: 1,blocked:1}).toArray();

    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error('Error logging in user:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  } 
}

export const POST = async (request) => {
  const { userId, action, reason } = await request.json();
  try {
    const db = await connectToDatabase();
    const collection = db.collection('Users');

    const update = action === 'block'
      ? { $set: { blocked: true, reason } }
      : { $unset: { blocked: '', reason: '' } };

    await collection.updateOne({ _id: new ObjectId(userId) }, update);
    return NextResponse.json({ message: `User ${action}ed successfully` });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}
