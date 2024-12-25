import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

export async function GET(req) {
    const client = new MongoClient(process.env.MONGO_URI);
    try {
        await client.connect();
        const db = client.db(process.env.DATABASE);
        const usersCollection = db.collection('Users');

        const totalUsers = await usersCollection.countDocuments();

        const topUsers = await usersCollection
            .find({}, { projection: { password: 0 ,image: 0} })
            .sort({ walletAmount: -1 })
            .limit(10)
            .toArray();

        const stats = {
            totalUsers,
            users:topUsers,
        };

        return NextResponse.json(stats, { status: 200 });
    } catch (error) {
        console.error("Error fetching user stats:", error);
        return NextResponse.json({ message: "Failed to fetch stats" }, { status: 500 });
    } finally {
        await client.close();
    }
}