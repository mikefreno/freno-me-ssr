import { JwtPayload } from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { env } from "@/env.mjs";
import { cookies } from "next/headers";
import { ConnectionFactory } from "@/app/api/database/ConnectionFactory";
import { User } from "@/types/model-types";
import { redirect } from "next/navigation";

export async function GET(
  request: NextRequest,
  context: { params: { email: string } }
) {
  const secretKey = env.JWT_SECRET_KEY;
  const params = request.nextUrl.searchParams;
  const token = params.get("token");
  const userEmail = context.params.email;
  try {
    if (token) {
      const decoded = jwt.verify(token, secretKey) as JwtPayload;
      if (decoded.email == userEmail) {
        const conn = ConnectionFactory();
        const query = `SELECT * FROM User WHERE email = ?`;
        const params = [decoded.email, userEmail];
        const res = await conn.execute(query, params);
        if (decoded.rememberMe) {
          cookies().set({
            name: "emailToken",
            value: decoded.email,
            maxAge: 60 * 60 * 24 * 14,
          });
          cookies().set({
            name: "userIDToken",
            value: (res.rows[0] as User).id,
            maxAge: 60 * 60 * 24 * 14,
          });
        } else {
          cookies().set({
            name: "emailToken",
            value: decoded.email,
          });
          cookies().set({
            name: "userIDToken",
            value: (res.rows[0] as User).id,
          });
        }
        return NextResponse.redirect(`${env.NEXT_PUBLIC_DOMAIN}/account`);
      }
    }
  } catch (err) {
    return new NextResponse(
      JSON.stringify({
        success: false,
        message: `authentication failed: ${err}`,
      }),
      { status: 401, headers: { "content-type": "application/json" } }
    );
  }
}