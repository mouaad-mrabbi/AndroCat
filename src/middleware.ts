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

export function middleware(request: NextRequest) {
  const url = request.nextUrl.pathname;

  // ✅ تجاهل الملفات ذات الامتدادات المحددة
  if (
    url.endsWith(".gz") ||
    url.endsWith(".tar.gz") ||
    url.endsWith(".zip") ||
    url.endsWith(".sql")
  ) {
    return NextResponse.next();
  }

  if (!url.startsWith("/admin")) {
    const slug = url.split("/").pop() || "";
    if (slug.endsWith("-mod-apk-android-download")) {
      const newSlug = slug.replace(/-mod-apk-android-download$/, "");
      const nextUrl = request.nextUrl.clone();
      nextUrl.pathname = url.replace(slug, newSlug);
      return NextResponse.redirect(nextUrl, 301);
    }
  }

  // 🔒 كود حماية /admin كما هو
  const jwtToken = request.cookies.get("jwtToken");
  const token = jwtToken ? jwtToken.value : null;

  if (!token) {
    if (!url.startsWith("/admin/login") && !url.startsWith("/admin/register")) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  } else {
    if (url === "/admin/login" || url === "/admin/register") {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/dashboard",
    "/admin/create",
    "/admin/images",
    "/admin/articles/:path*",
    "/admin/register",
    "/admin/login",

    // فقط صفحات المقال التي قد تحتاج إعادة التوجيه
    "/:slug*-mod-apk-android-download",
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
    "/admin/articles/:path*",
    "/admin/register",
    "/admin/login",
  ],
}; */
