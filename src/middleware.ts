import { cookies } from "next/headers";
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
    let token = request.cookies.get("userIDToken");
    if (!(token && token.value == env.ADMIN_ID)) {
      return new NextResponse(
        JSON.stringify({ success: false, message: "authentication failed" }),
        { status: 401, headers: { "content-type": "application/json" } }
      );
    }
  }
}
