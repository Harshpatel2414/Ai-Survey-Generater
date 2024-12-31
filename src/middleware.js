import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

// Allowed origins for CORS
const ALLOWED_ORIGINS = [
  "https://ai-survey-generator.vercel.app", // Production domain
];

// Public routes that don't require authentication
const PUBLIC_ROUTES = [
  "/api/login",
  "/api/register",
  "/api/logout",
  "/api/forgot-password",
  "/api/send-otp",
  "/api/contact",
];

function verifyCsrfToken(req) {
  const csrfTokenFromHeader = req.headers.get("x-csrf-token");
  const csrfTokenFromCookie = req.cookies.get("csrf-token")?.value;

  // CSRF token should match the one stored in the cookie
  if (!csrfTokenFromHeader || csrfTokenFromHeader !== csrfTokenFromCookie) {
    throw new Error("Invalid CSRF token");
  }
}

// Utility function to verify the token
async function verifyToken(token) {
  if (!token) {
    throw new Error("No token provided");
  }

  const secretKey = process.env.JWT_SECRET;
  if (!secretKey) {
    throw new Error("Missing JWT_SECRET environment variable");
  }

  const { payload } = await jwtVerify(token, new TextEncoder().encode(secretKey), {
    algorithms: ["HS256"],
  });

  return payload;
}

// Middleware function
export async function middleware(req) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("jwtAuth")?.value;

  // Add CORS headers
  const origin = req.headers.get("origin");
  const response = NextResponse.next();
  if (ALLOWED_ORIGINS.includes(origin)) {
    response.headers.set("Access-Control-Allow-Origin", origin);
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    response.headers.set("Access-Control-Allow-Credentials", "true");
  }

  // Handle preflight OPTIONS request
  if (req.method === "OPTIONS") {
    return response;
  }

  try {
    // Verify the token if available
    const payload = token ? await verifyToken(token) : null;

    if (!PUBLIC_ROUTES.includes(pathname) && pathname.startsWith("/api/")) {
      verifyCsrfToken(req);
    }
 
    // Prevent access to "/" if the user has a valid token
    if (pathname === "/" && payload) {
      return NextResponse.redirect(new URL("/home", req.url)); 
    }

    // Allow access to public routes
    if (PUBLIC_ROUTES.includes(pathname)) {
      return response;
    }
    if(pathname === "/admin"){
      return response;
    }
    // Admin routes protection
    if (pathname.startsWith("/admin")) {
      if (!payload) {
        return NextResponse.redirect(new URL("/admin", req.url));
      }
      if (payload.role !== "admin") {
        return NextResponse.redirect(new URL("/admin", req.url));
      }
      return response;
    }

    // API routes protection
    if (pathname.startsWith("/api/")) {
      if (!payload) {
        return NextResponse.json(
          { error: "Unauthorized", message: "You must be logged in to access this route" },
          { status: 401 }
        );
      }
      if (pathname.startsWith("/api/admin") && payload.role !== "admin") {
        return NextResponse.json(
          { error: "Forbidden", message: "You do not have access to this resource" },
          { status: 403 }
        );
      }
      return response;
    }
  } catch (error) {
    console.error("Middleware error:", error);
    const redirectResponse = NextResponse.redirect(new URL("/login", req.url));
    if (token) {
      redirectResponse.cookies.set("jwtAuth", "", { maxAge: -1 }); // Delete the cookie
    }
    // Handle invalid token or other errors
    if (pathname.startsWith("/api/")) {
      return NextResponse.json(
        { error: "Unauthorized", message: "Invalid or expired token" },
        { status: 401 }
      );
    }

    // Redirect to login page for admin routes on error
    if (pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
    return redirectResponse; // Redirect user to /login for non-API routes
  }

  return response;
}

// Configuration for middleware
export const config = {
  matcher: ["/admin/:path*", "/api/:path*", "/"], 
};
