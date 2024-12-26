export const maxDuration = 30;
import { MongoClient } from 'mongodb';
import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

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
            role: 'user',
            email,
            image,
            password: hashedPassword,
            termsAndConditionsAccepted: termsAccepted,
            walletAmount: 0,
            createdAt: new Date().toISOString(),
        };

        const result = await collection.insertOne(newUser);

        const token = createToken(result.insertedId);

        const response = NextResponse.json(
            {
                message: 'Registration successful',
                user: { _id: result.insertedId, role: "user", username, email, image, walletAmount: 0 },
            },
            { status: 201 }
        );

        response.cookies.set('jwtAuth', token, {
            httpOnly: true,
            path: '/',
            secure: true,
            sameSite: 'strict',
            maxAge: 24 * 60 * 60, // 1 day
        });

        return response;
    } catch (error) {
        console.error('Error registering user:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    } finally {
        await client.close();
    }
};

const maxAge = 24 * 60 * 60;
const sec_key = process.env.JWT_SECRET;

const createToken = (id) => {
    return jwt.sign({ id }, sec_key, {
        expiresIn: maxAge
    });
};