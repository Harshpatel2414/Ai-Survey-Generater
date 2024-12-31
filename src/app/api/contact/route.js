export const maxDuration = 30;
import { NextResponse } from 'next/server';
import connectToDatabase from '@/utils/mongodb';

export const POST = async (req) => {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
        return NextResponse.json({ message: 'Missing required fields.' }, { status: 400 });
    }

    try {
        let db = await connectToDatabase();
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
    } 
};