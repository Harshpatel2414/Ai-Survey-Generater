import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import { SignJWT } from 'jose';
import crypto from 'crypto';
import { nanoid } from 'nanoid';
import connectToDatabase from '@/utils/mongodb';

const registerSchema = z.object({
  username: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(8),
  image: z.string().url().optional().refine(val => val === '' || val, {
    message: "Invalid URL",
  }),
  termsAccepted: z.boolean(),
});

const createToken = async (id) => {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);
  return new SignJWT({ id })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1d') // 1 day
    .setJti(nanoid()) // Unique token ID
    .sign(secret);
};

const generateCSRFToken = () => {
  return crypto.randomBytes(32).toString('hex'); // Secure CSRF token (64 characters)
};

export const POST = async (req) => {
 
  try {
    const { username, email, password, image, termsAccepted } = registerSchema.parse(await req.json());

    let db = await connectToDatabase();
    const collection = db.collection('Users');

    const existingUser = await collection.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: 'User already exists' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = {
      username,
      email,
      image: image || '', // Defaults to an empty string if no image is provided
      password: hashedPassword,
      termsAndConditionsAccepted: termsAccepted,
      role: 'user',
      walletAmount: 0,
      createdAt: new Date().toISOString(),
    };

    const result = await collection.insertOne(newUser);
    const token = await createToken(result.insertedId.toString());
    const csrfToken = generateCSRFToken();

    const response = NextResponse.json(
      {
        message: 'Registration successful',
        user: { id: result.insertedId, image: image || '', username, email, walletAmount: 0 },
      },
      { status: 201 }
    );

    response.cookies.set('jwtAuth', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 24 * 60 * 60, // 1 day
    });

    response.cookies.set('csrfToken', csrfToken, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 24 * 60 * 60, // 1 day
    });

    return response;
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  } 
};
