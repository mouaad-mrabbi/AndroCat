/* import { NextResponse, NextRequest } from "next/server";
import { DOMAIN } from "./utils/constants";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // إعداد CORS
  response.headers.set("Access-Control-Allow-Origin", DOMAIN);
  response.headers.set("Access-Control-Allow-Credentials", "true");
  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );

  // التعامل مع طلبات `OPTIONS`
  if (request.method === "OPTIONS") {
    return new NextResponse(null, { status: 204 });
  }

  return response;
}

export const config = {
  matcher: "/api/:path*", // يطبق على جميع مسارات API
}; */

import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "./utils/verifyToken";
import prisma from "@/utils/db";

export function middleware(request: NextRequest) {
  const jwtToken = request.cookies.get("jwtToken");
  const token = jwtToken ? jwtToken.value : null;

  if (!token) {
    if (
      !request.nextUrl.pathname.startsWith("/admin/login") &&
      !request.nextUrl.pathname.startsWith("/admin/register")
    ) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  } else {
    if (
      request.nextUrl.pathname === "/admin/login" ||
      request.nextUrl.pathname === "/admin/register"
    ) {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
  }
}

export const config = {
  matcher: [
    "/admin/dashboard",
    "/admin/create",
    "/admin/images",
    "/admin/items/:path*",
    "/admin/register",
    "/admin/login",
  ],
};

/* export async function middleware(request: NextRequest) {
  const jwtToken = request.cookies.get("jwtToken");
  const token = jwtToken ? jwtToken.value : null;

  if (!token) {
    if (
      !request.nextUrl.pathname.startsWith("/admin/login") &&
      !request.nextUrl.pathname.startsWith("/admin/register")
    ) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  } else {
    try {
      const userFromToken = verifyToken(request);
      if (!userFromToken) {
        return NextResponse.json(
          { message: "Access denied, you are not authorized" },
          { status: 403 }
        );
      }
      const userId = userFromToken.id;
      const storedUpdatedAt = userFromToken.updatedAt;

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { updatedAt: true },
      });

      if (!user || new Date(user.updatedAt).getTime() !== new Date(storedUpdatedAt).getTime()) {
        // إذا تغير `updatedAt`، قم بتسجيل الخروج
        const response = NextResponse.redirect(new URL("/admin/login", request.url));
        response.cookies.delete("jwtToken");
        return response;
      }
      
      // منع الوصول لصفحة تسجيل الدخول أو التسجيل إذا كان المستخدم مسجلاً بالفعل
      if (
        request.nextUrl.pathname === "/admin/login" ||
        request.nextUrl.pathname === "/admin/register"
      ) {
        return NextResponse.redirect(new URL("/admin/dashboard", request.url));
      }
      
    } catch (error) {
      const response = NextResponse.redirect(new URL("/admin/login", request.url));
      response.cookies.delete("jwtToken");
      return response;
    }
  }
}

export const config = {
  matcher: [
    "/admin/dashboard",
    "/admin/create",
    "/admin/images",
    "/admin/items/:path*",
    "/admin/register",
    "/admin/login",
  ],
}; */
