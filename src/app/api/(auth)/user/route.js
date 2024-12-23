export const maxDuration = 30;
import { MongoClient, ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';

export const GET = async (req) => {
  const client = new MongoClient(process.env.MONGO_URI);
  try {
    await client.connect();
    const db = client.db(process.env.DATABASE);
    const collection = db.collection('Users');

    const user = await collection.find().project({username: 1, email: 1, _id: 1,walletAmount:1}).toArray();

    return NextResponse.json( user , { status: 200 });
  } catch (error) {
    console.error('Error logging in user:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  } finally {
    await client.close();
  }
}

export const POST = async (req) => {
  const { userId } = await req.json();
  const client = new MongoClient(process.env.MONGO_URI);

  try {
    await client.connect();
    const db = client.db(process.env.DATABASE);
    const collection = db.collection('Users');

    const user = await collection.findOne({ _id: new ObjectId(userId)});
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 400 });
    }

    delete user.password;

    return NextResponse.json( user , { status: 200 });
  } catch (error) {
    console.error('Error logging in user:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  } finally {
    await client.close();
  }
};
