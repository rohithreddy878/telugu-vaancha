// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  //console.log("i am here  ",process.env);
  // Skip auth in development
  if (process.env.NODE_ENV === "development") {
    //console.log("skipping auth for dev")
    return NextResponse.next();
  }

  // Only protect /admin routes
  const { pathname } = req.nextUrl;
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const auth = req.headers.get("authorization");
  const basicAuth = auth?.split(" ")[1];
  const [user, pwd] = basicAuth
    ? Buffer.from(basicAuth, "base64").toString().split(":")
    : [];

  if (user === process.env.ADMIN_USER && pwd === process.env.ADMIN_PASS) {
    return NextResponse.next();
  }

  return new NextResponse("Auth required", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Secure Area"' },
  });
}

export const config = {
  matcher: ["/admin/:path*"],
};
