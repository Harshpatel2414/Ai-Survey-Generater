import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const PUBLIC_ROUTES = [
  '/api/login', 
  '/api/me',
  '/api/register',
  '/api/forgot-password',
  '/api/send-otp',
  '/api/contact',
];

async function verifyToken(token) {
  if (!token) {
    throw new Error("No token provided");
  }
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);
  const { payload } = await jwtVerify(token, secret);
  return payload;
}

export async function middleware(req) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("jwtAuth")?.value;
  const payload = token ? await verifyToken(token) : null;


  // Admin dashboard route
  if (pathname === "/admin") {
    return NextResponse.next();
  }

  // Protect admin routes
  if (pathname.startsWith("/admin/")) {
    if (!token) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }

    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      const { payload } = await jwtVerify(token, secret);
      if (payload.role !== "admin") {
        return NextResponse.redirect(new URL("/admin", req.url));
      }
      return NextResponse.next();
    } catch (error) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
  }
  
  if (PUBLIC_ROUTES.includes(pathname)) {
    return NextResponse.next();
  }
  // Protect all other API routes
  if (pathname.startsWith("/api/")) {
    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized", message: "You must be logged in to access this route" },
        { status: 401 }
      );
    }
    if (payload) {
      if (pathname.startsWith("/api/admin")) {
        // Allow access to other API routes for admins
        if (payload.role === "admin") {
          return NextResponse.next();
        }
        return NextResponse.json(
          { message: "Unauthorised access details" },
          { status: 403 }
        );
      }
      return NextResponse.next();

    } else {
      return NextResponse.json(
        { message: "Unauthorised access details" },
        { status: 403 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/:path*"],
};
