import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { MongoClient, ObjectId } from "mongodb";

export const GET = async (req) => {
  // Await the cookies() call
  const cookieStore = await cookies(req);
  const token = cookieStore.get('jwtAuth')?.value;

  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Verify the JWT token
    const { id } = jwt.verify(token, process.env.NEXT_PUBLIC_JWT_SECRET);

    // Connect to the database and fetch user details
    const client = new MongoClient(process.env.MONGO_URI);
    await client.connect();
    const db = client.db(process.env.DATABASE);
    const collection = db.collection('Users');

    const user = await collection.findOne({ _id: new ObjectId(id) });
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Remove the password from the response
    delete user.password;

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
};
