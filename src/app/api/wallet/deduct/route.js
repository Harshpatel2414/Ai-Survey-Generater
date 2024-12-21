import { MongoClient, ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';

export const POST = async (req) => {
    const { userId, amount } = await req.json();
    const client = new MongoClient(process.env.MONGO_URI);

    try {
        await client.connect();
        const db = client.db(process.env.DATABASE);
        const collection = db.collection('Users');
        let fixedAmount = parseFloat(amount).toFixed(2);
        const result = await collection.updateOne(
            { _id: new ObjectId(userId) },
              { 
                $inc: { walletAmount: -fixedAmount },
            }
        );

        if (result.modifiedCount === 0) {
            return NextResponse.json({ message: 'User not found or wallet update failed' }, { status: 400 });
        }

        return NextResponse.json({ message: 'Wallet updated successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error while deduct money from wallet:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    } finally {
        await client.close();
    }
};
