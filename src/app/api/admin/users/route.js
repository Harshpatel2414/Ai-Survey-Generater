export const maxDuration = 30;
import { MongoClient, ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';

export const GET = async (req) => {
  const client = new MongoClient(process.env.MONGO_URI);
  try {
    await client.connect();
    const db = client.db(process.env.DATABASE);
    const collection = db.collection('Users');

    const user = await collection.find().project({ username: 1, email: 1, _id: 1, walletAmount: 1,blocked:1}).toArray();

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error('Error logging in user:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  } finally {
    await client.close();
  }
}

export const POST = async (request) => {
  const { userId, action, reason } = await request.json();
  try {
    const client = new MongoClient(process.env.MONGO_URI);
    await client.connect();
    const db = client.db(process.env.DATABASE);
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
