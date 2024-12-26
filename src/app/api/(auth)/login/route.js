export const maxDuration = 30;
import { MongoClient } from 'mongodb';
import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

export const POST = async (req) => {
  const { email, password } = await req.json();
  const client = new MongoClient(process.env.MONGO_URI);

  try {
    await client.connect();
    const db = client.db(process.env.DATABASE);
    const collection = db.collection('Users');

    const user = await collection.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 400 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json({ message: 'Invalid password' }, { status: 400 });
    }

    const token = createToken(user._id, user.role);
    const response = NextResponse.json(
      { message: 'Login successful', user },
      { status: 200 }
    );

    response.cookies.set('jwtAuth', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/',
      maxAge: 24 * 60 * 60, 
    });

    return response;
  } catch (error) {
    console.error('Error logging in user:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  } finally {
    await client.close();
  }
};

const maxAge = 24 * 60 * 60;
const sec_key = process.env.JWT_SECRET;

const createToken = (id, role) => {
  return jwt.sign({ id, role }, sec_key, {
    expiresIn: maxAge
  });
};