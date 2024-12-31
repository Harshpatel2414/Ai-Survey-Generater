import connectToDatabase from "@/utils/mongodb"; 
import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        const db = await connectToDatabase();
        const usersCollection = db.collection('Users');

        // Fetch the total count of users
        const totalUsers = await usersCollection.countDocuments();

        // Fetch the top 10 users sorted by walletAmount in descending order
        const topUsers = await usersCollection
            .find({}, { projection: { password: 0, image: 0 } })
            .sort({ walletAmount: -1 })
            .limit(10)
            .toArray();

        const stats = {
            totalUsers,
            users: topUsers,
        };

        // Return stats as a JSON response
        return NextResponse.json(stats, { status: 200 });
    } catch (error) {
        console.error("Error fetching user stats:", error);
        // Return error response with message and status code
        return NextResponse.json({ message: "Failed to fetch stats" }, { status: 500 });
    }
}
