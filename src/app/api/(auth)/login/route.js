import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const data = await request.json();
        // Process the payment success data here
        console.log('Login user details', data);

        return NextResponse.json({ message: 'Login successful' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Login failed', error: error.message }, { status: 500 });
    }
}