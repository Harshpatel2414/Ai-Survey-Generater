import { MongoClient } from 'mongodb';
import { NextResponse } from 'next/server';


export const POST = async (req) => {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
        return NextResponse.json({ message: 'Missing required fields.' }, { status: 400 });
    }

    let client;

    try {
        client = new MongoClient(process.env.MONGO_URI);
        await client.connect();

        const db = client.db(process.env.DATABASE);
        const contactsCollection = db.collection('Contacts');

       await contactsCollection.insertOne({
            name,
            email,
            message,
            createdAt: new Date(),
        });

        return NextResponse.json({ message: 'Contact form submitted successfully.' }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: 'An error occurred while submitting the form.' }, { status: 500 });
    } finally {
        client.close();
    }
};