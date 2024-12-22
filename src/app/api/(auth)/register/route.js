export const maxDuration = 30;
import { MongoClient } from 'mongodb';
import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';

export const POST = async (req) => {
    const { username, email, password, image, termsAccepted } = await req.json();
    const client = new MongoClient(process.env.MONGO_URI);

    try {
        await client.connect();
        const db = client.db(process.env.DATABASE);
        const collection = db.collection('Users');

        const existingUser = await collection.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ message: 'User already exists' }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = {
            username,
            email,
            image,
            password: hashedPassword,
            termsAndConditionsAccepted: termsAccepted,
            walletAmount: 0,
            profilesGenerated: 0,
        };

        const result = await collection.insertOne(newUser);
        return NextResponse.json({
            message: 'Registration successful',
            user: { _id: result.insertedId, username, email,image, walletAmount: 0 },
        }, { status: 201 });
    } catch (error) {
        console.error('Error registering user:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    } finally {
        await client.close();
    }
};
