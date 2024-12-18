import { NextResponse } from "next/server";

export const POST = async (request) => {
    try {
        const data = await request.json();
        // Process the payment success data here
        console.log('Register user details', data);

        return NextResponse.json({ message: 'User registered successfuly' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'User registration failed', error: error.message }, { status: 500 });
    }
}