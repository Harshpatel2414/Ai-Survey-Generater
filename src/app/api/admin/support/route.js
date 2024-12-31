import { NextResponse } from "next/server";
import connectToDatabase from "@/utils/mongodb";
import nodemailer from "nodemailer";

export async function GET(req) {
 
  try {
    let db = await connectToDatabase();
    const contactsCollection = db.collection("Contacts");

    // Fetch all contact messages
    const supportMessages = await contactsCollection
      .find()
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(supportMessages, { status: 200 });
  } catch (error) {
    console.error("Error fetching support messages:", error);
    return NextResponse.json({ message: "Failed to fetch support messages" }, { status: 500 });
  }
}

export async function POST(req) {
  const { email, replyMessage } = await req.json();

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.NODEMAIL_EMAIL,
      pass: process.env.NODEMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.NODEMAIL_EMAIL,
    to: email,
    subject: "AI-Survey Support Reply",
    text: replyMessage,
  };

  try {
    // Send email
    await transporter.sendMail(mailOptions);

    let db = await connectToDatabase();
    const contactsCollection = db.collection("Contacts");

    await contactsCollection.updateOne(
      { email },
      { $set: { reply: replyMessage, repliedAt: new Date() } }
    );

    return NextResponse.json({ message: "Reply sent successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error sending reply:", error);
    return NextResponse.json({ message: "Failed to send reply" }, { status: 500 });
  }
}