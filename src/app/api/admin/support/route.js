import { NextResponse } from "next/server";
import connectToDatabase from "@/utils/mongodb";
import nodemailer from "nodemailer";

export async function GET(req) {
  try {
    const db = await connectToDatabase();
    const contactsCollection = db.collection("Contacts");

    // Fetch all contact messages sorted by createdAt in descending order
    const supportMessages = await contactsCollection
      .find()
      .sort({ createdAt: -1 })
      .toArray();

    // Return the support messages as a JSON response
    return NextResponse.json(supportMessages, { status: 200 });
  } catch (error) {
    console.error("Error fetching support messages:", error);
    // Return error response
    return NextResponse.json({ message: "Failed to fetch support messages" }, { status: 500 });
  }
}

export async function POST(req) {
  const { email, replyMessage } = await req.json();

  // Set up the nodemailer transport configuration
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.NODEMAIL_EMAIL,
      pass: process.env.NODEMAIL_PASSWORD,
    },
  });

  // Set up the email options
  const mailOptions = {
    from: process.env.NODEMAIL_EMAIL,
    to: email,
    subject: "AI-Survey Support Reply",
    text: replyMessage,
  };

  try {
    // Send the email reply to the user
    await transporter.sendMail(mailOptions);

    // Connect to the database and update the message in the collection
    const db = await connectToDatabase();
    const contactsCollection = db.collection("Contacts");

    await contactsCollection.updateOne(
      { email },
      { $set: { reply: replyMessage, repliedAt: new Date() } }
    );

    // Return success response
    return NextResponse.json({ message: "Reply sent successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error sending reply:", error);
    // Return error response
    return NextResponse.json({ message: "Failed to send reply" }, { status: 500 });
  }
}
