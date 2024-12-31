import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import connectToDatabase from '@/utils/mongodb';

export const POST = async (req) => {
  const { email, otp, newPassword } = await req.json();

  try {
    let db = await connectToDatabase();
    const collection = db.collection('Users');

    const user = await collection.findOne({ email });
    if (!user || user.otp !== otp || new Date() > new Date(user.otpExpiresAt)) {
      return NextResponse.json({ message: 'Invalid or expired OTP' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await collection.updateOne(
      { email },
      { $set: { password: hashedPassword, otp: null, otpExpiresAt: null } }
    );

    return NextResponse.json({ message: 'Password reset successful' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
} 