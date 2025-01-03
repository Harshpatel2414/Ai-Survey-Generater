import { NextResponse } from "next/server";
import connectToDatabase from "@/utils/mongodb";
import { ObjectId } from "mongodb";

// Get all blogs
export const GET = async () => {
  try {
    const db = await connectToDatabase();
    const blogs = await db.collection("Blogs").find().toArray();
    return NextResponse.json(blogs, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error fetching blogs" }, { status: 500 });
  }
};

// Add a new blog
export const POST = async (req) => {
  try {
    const { title, content, image } = await req.json();
    const db = await connectToDatabase();
    const blog = { title, content, image, createdAt: new Date(), updatedAt: new Date() };
    const result = await db.collection("Blogs").insertOne(blog);
    let id = result.insertedId;
    return NextResponse.json({message: "Blog Added Successfully.",_id: id}, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Error adding blog" }, { status: 500 });
  }
};

// Edit a blog
export const PUT = async (req) => {
  try {
    const { _id, title, content, image } = await req.json();
    const db = await connectToDatabase();
    const updatedBlog = await db.collection("Blogs").updateOne(
      { _id: new ObjectId(_id) },
      { $set: { title, content, image, updatedAt: new Date() } }
    );
    return NextResponse.json({message: "Blog Updated Successfully."}, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error updating blog" }, { status: 500 });
  }
};

// Delete a blog
export const DELETE = async (req) => {
  try {
    const { id } = await req.json();
    const db = await connectToDatabase();
    const deletedBlog = await db.collection("Blogs").deleteOne({ _id: new ObjectId(id) });
    return NextResponse.json(deletedBlog, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error deleting blog" }, { status: 500 });
  }
};
