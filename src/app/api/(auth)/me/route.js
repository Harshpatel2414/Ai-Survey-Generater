import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { ObjectId } from 'mongodb';
import connectToDatabase from '@/utils/mongodb';

const verifyToken = async (token) => {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);
  const { payload } = await jwtVerify(token, secret);
  return payload;
};

export const GET = async (req) => {
  const token = req.cookies.get('jwtAuth')?.value;

  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await verifyToken(token);

    let db = await connectToDatabase();
    const collection = db.collection('Users');

    const user = await collection.findOne({ _id: new ObjectId(id) });
    if (!user) {
      return NextResponse.json(null, { status: 404 });
    }

    delete user.password;

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error('Token verification or database error:', error);
    return NextResponse.json(null, { status: 500 });
  }
};
