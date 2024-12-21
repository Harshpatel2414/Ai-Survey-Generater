export const maxDuration = 30;
import { MongoClient, ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';

export const POST = async (req) => {
    const { userId, amount } = await req.json();
    const client = new MongoClient(process.env.MONGO_URI);

    try {
        await client.connect();
        const db = client.db(process.env.DATABASE);
        const collection = db.collection('Users');

        const result = await collection.updateOne(
            { _id: new ObjectId(userId) },
            {
                $inc: { walletAmount: amount },
                $set: { walletAmount: { $round: ["$walletAmount", 2] } }
            }
        );

        if (result.modifiedCount === 0) {
            return NextResponse.json({ message: 'User not found or wallet update failed' }, { status: 400 });
        }

        return NextResponse.json({ message: 'Money added to Wallet successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error adding money to wallet:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    } finally {
        await client.close();
    }
};
