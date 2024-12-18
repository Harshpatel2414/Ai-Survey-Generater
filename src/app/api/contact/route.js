import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const data = await request.json();
        // Process the contact data here
        console.log('Contact data received:', data);

        // You can add your logic to save the data to a database or send an email

        return NextResponse.json({ message: 'Contact data submitted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error processing contact data:', error);
        return NextResponse.json({ message: 'Error submitting contact data' }, { status: 500 });
    }
}