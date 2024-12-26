import { NextResponse } from 'next/server';

export const GET = async () => {
  const response = NextResponse.json({ message: 'Logout successful' });

  response.cookies.set('jwtAuth', '', {
    httpOnly: true,
    path: '/',
    maxAge: 0, 
  });

  return response;
};