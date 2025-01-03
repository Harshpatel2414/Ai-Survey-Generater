import {NextResponse} from 'next/server';
import connectToDatabase from '@/utils/mongodb';
import { ObjectId } from 'mongodb';

export const GET = async () => {
  try {
    const db = await connectToDatabase();
    const blogs = await db.collection("Blogs").find({}).sort({ updatedAt: -1 }).toArray();
    return NextResponse.json(blogs , { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
};

export const POST = async (req) => {
  let { blogId } = await req.json();
  try {
    const db = await connectToDatabase();
    const blogCollection = db.collection("Blogs");
    const blog = await blogCollection.findOne({ _id: new ObjectId(blogId) });
    return NextResponse.json(blog , { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
};