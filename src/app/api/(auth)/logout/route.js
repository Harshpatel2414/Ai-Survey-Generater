import { NextResponse } from 'next/server';

export const GET = async () => {
  const response = NextResponse.json({ message: 'Logout successful' });

  // Clear the 'jwtAuth' cookie
  response.cookies.set('jwtAuth', '', {
    httpOnly: true,
    path: '/',
    maxAge: 0, 
  });

  return response;
};