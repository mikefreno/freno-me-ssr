import { NextRequest, NextResponse } from "next/server";
import { env } from "./env.mjs";
export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.match("/login")) {
    let token = request.cookies.get("userIDToken");
    if (token) {
      return NextResponse.redirect(`${env.NEXT_PUBLIC_DOMAIN}/account`);
    }
  }

  if (request.nextUrl.pathname.match("/account")) {
    let token = request.cookies.get("userIDToken");
    if (!token) {
      return NextResponse.redirect(`${env.NEXT_PUBLIC_DOMAIN}/login`);
    }
  }
  if (
    request.nextUrl.pathname.match("/blog/create") ||
    request.nextUrl.pathname.match("/projects/create") ||
    request.nextUrl.pathname.match(/^\/_debug/)
  ) {
    let cookie = request.cookies.get("userIDToken");
    let id: string | null = null;
    try {
      if (cookie) {
        const res = await fetch(
          `${env.NEXT_PUBLIC_DOMAIN}/api/user-data/parse-cookie/${cookie.value}`
        );
        id = (await res.json()).id;
      }
      if (!(id && id == env.ADMIN_ID)) {
        return new NextResponse(
          JSON.stringify({ success: false, message: "authentication failed" }),
          { status: 401, headers: { "content-type": "application/json" } }
        );
      }
    } catch (error) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "authentication failed",
        }),
        { status: 401, headers: { "content-type": "application/json" } }
      );
    }
  }
}
