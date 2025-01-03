import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import { rateLimiter } from '@/utils/rateLimit';
import { SignJWT } from 'jose';
import crypto from 'crypto';
import { nanoid } from 'nanoid';
import connectToDatabase from '@/utils/mongodb';

const maxAttempts = 3;
const timeWindow = 15 * 60 * 1000; // 15 minutes

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const createToken = async (id, role) => {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);
  return new SignJWT({ id, role })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1d') // 1 day
    .setJti(nanoid()) // Unique identifier
    .sign(secret);
};

const generateCSRFToken = () => {
  return crypto.randomBytes(32).toString('hex'); // Secure CSRF token (64 characters)
};

const getClientIp = (req) => {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  let ip = req.ip || req.connection?.remoteAddress || req.socket?.remoteAddress;
  if(ip === "::1") {
    ip = "127.0.0.1"
  }
  return ip ; 
};

export const POST = async (req) => {
  const ip = getClientIp(req);
  console.log("ip >>>", ip)

  if (!rateLimiter(ip, maxAttempts, timeWindow)) {
    return NextResponse.json({ message: 'Too many login attempts. Try again later.' }, { status: 429 });
  }

  try {
    const { email, password } = loginSchema.parse(await req.json());

    let db = await connectToDatabase();
    const collection = db.collection('Users');

    const user = await collection.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: 'Invalid email or password' }, { status: 400 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ message: 'Invalid email or password' }, { status: 400 });
    }

    const token = await createToken(user._id, user.role);
    const csrfToken = generateCSRFToken();

    const response = NextResponse.json(
      { message: 'Login successful', user },
      { status: 200 }
    );

    response.cookies.set('jwtAuth', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 24 * 60 * 60, // 1 day
    });

    response.cookies.set('csrf-token', csrfToken, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 24 * 60 * 60, // 1 day
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
};
