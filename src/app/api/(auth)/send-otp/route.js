import { NextResponse } from 'next/server';
import connectToDatabase from '@/utils/mongodb';
import nodemailer from 'nodemailer';

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

export const POST = async (req) => {
  try {
    const { email } = await req.json();  // Parse the request body to get the email
    const otp = generateOTP();  // Generate OTP

    if (!email) {
      return NextResponse.json({ message: 'Email is required!' }, { status: 400 });
    }

    let db = await connectToDatabase();  // Ensure connection to the database
    const collection = db.collection('Users');

    const user = await collection.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: 'User not found! Enter valid email' }, { status: 400 });
    }

    // Store OTP and expiry time in the database (valid for 2 minutes)
    await collection.updateOne(
      { email },
      { $set: { otp, otpExpiresAt: new Date(Date.now() + 2 * 60 * 1000) } }
    );

    // Set up Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.NODEMAIL_EMAIL,
        pass: process.env.NODEMAIL_PASSWORD,
      },
    });

    // Mail options for OTP email
    const mailOptions = {
      from: process.env.NODEMAIL_EMAIL,
      to: email,
      subject: 'Reset Your Password - AI-Survey OTP',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: 'Arial', sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 40px auto; padding: 20px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); }
            .header { text-align: center; margin-bottom: 20px; }
            .header img { width: 60px; height: 60px; margin-bottom: 10px; }
            .header h1 { color: #4e8d99; font-size: 24px; margin: 0; }
            .message { font-size: 16px; color: #333333; line-height: 1.6; text-align: center; margin-bottom: 20px; }
            .otp { font-size: 20px; font-weight: bold; background-color: #e8f6f7; color: #4e8d99; padding: 15px; border-radius: 5px; text-align: center; margin: 20px auto; width: fit-content; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); }
            .note { font-size: 14px; color: #777777; text-align: center; margin-top: 20px; }
            .warning { font-size: 14px; color: #ff0000; text-align: center; margin-top: 20px; }
            .footer { font-size: 12px; color: #888888; text-align: center; margin-top: 30px; }
            .footer a { color: #4e8d99; text-decoration: none; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <img src="https://ai-survey-generater.vercel.app/logo.png" alt="AI-Survey Logo" />
              <h1>AI-Survey</h1>
            </div>
            <div class="message">
              You have requested to reset your password. Use the OTP below to complete the process:
            </div>
            <div class="otp">${otp}</div>
            <div class="warning">
              This OTP is valid for 2 minutes. Do not share it with anyone.
            </div>
            <div class="note">
              If you didn't request this, please ignore this email or contact our support team.
            </div>
            <div class="footer">
              <p>Need help? <a href="https://ai-survey-generater.vercel.app/contact">Contact Support</a></p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    // Send the OTP email
    await transporter.sendMail(mailOptions);

    // Respond with success
    return NextResponse.json({ message: 'OTP sent to email' }, { status: 200 });
  } catch (error) {
    // Log any errors for debugging
    console.error('Error sending OTP:', error);

    // Return an error response
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
};
