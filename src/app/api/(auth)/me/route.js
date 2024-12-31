import connectToDatabase from "@/utils/mongodb";
import { NextResponse } from "next/server";
import { ObjectId } from 'mongodb';
import { jwtVerify } from "jose";

// Utility function to verify the JWT token
const verifyToken = async (token) => {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);
  const { payload } = await jwtVerify(token, secret);
  return payload;
};

export const GET = async (req) => {
  const token = req.cookies.get('jwtAuth')?.value; // Extract the token from cookies

  if (!token) {
    // If no token, return Unauthorized response
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Verify the token and extract user ID
    const { id } = await verifyToken(token);

    // Connect to the database
    const db = await connectToDatabase();
    const collection = db.collection('Users');

    // Fetch the user from the database using ObjectId
    const user = await collection.findOne({ _id: new ObjectId(id) });
    
    // If no user is found, return 404 Not Found
    if (!user) {
      return NextResponse.json(null, { status: 404 });
    }

    // Remove the password from the user object before returning
    delete user.password;

    // Return the user object as JSON with status 200
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    // Catch any errors during token verification or database operations
    console.error('Token verification or database error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
};
