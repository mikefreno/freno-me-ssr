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
}
