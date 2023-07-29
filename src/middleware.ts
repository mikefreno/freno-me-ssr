import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { env } from "./env.mjs";
import jwt, { JwtPayload } from "jsonwebtoken";
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
        jwt.verify(cookie?.value, env.JWT_SECRET_KEY, async (err, decoded) => {
          if (err) {
            console.log("Failed to authenticate token.");
          } else {
            id = (decoded as JwtPayload).id;
          }
        });
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
