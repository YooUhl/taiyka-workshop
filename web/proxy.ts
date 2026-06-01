import { NextResponse, type NextRequest } from "next/server";
import { timingSafeEqual } from "node:crypto";

const COOKIE_NAME = "tools_access";
const ONE_YEAR = 60 * 60 * 24 * 365;

function safeEq(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
}

export function proxy(request: NextRequest) {
  const secret = process.env.TOOLS_ACCESS_SECRET;
  if (!secret) return new NextResponse(null, { status: 404 });

  const providedKey = request.nextUrl.searchParams.get("key");

  if (providedKey) {
    if (!safeEq(providedKey, secret)) {
      return new NextResponse(null, { status: 404 });
    }
    const cleanUrl = request.nextUrl.clone();
    cleanUrl.searchParams.delete("key");
    const res = NextResponse.redirect(cleanUrl);
    res.cookies.set(COOKIE_NAME, secret, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: ONE_YEAR,
    });
    return res;
  }

  const cookie = request.cookies.get(COOKIE_NAME)?.value;
  if (cookie && safeEq(cookie, secret)) return NextResponse.next();
  return new NextResponse(null, { status: 404 });
}

export const config = { matcher: "/tools/:path*" };
