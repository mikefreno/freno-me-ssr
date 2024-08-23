import { NextRequest, NextResponse } from "next/server";
import { env } from "@/env.mjs";
import jwt, { JwtPayload } from "jsonwebtoken";
import { MagicDelveConnectionFactory, MagicDelveDBInit } from "@/app/utils";

export async function GET(
  request: NextRequest,
  context: { params: { email: string } },
) {
  const secretKey = env.JWT_SECRET_KEY;
  const params = request.nextUrl.searchParams;
  const token = params.get("token");
  const userEmail = context.params.email;
  try {
    if (token) {
      const decoded = jwt.verify(token, secretKey) as JwtPayload;
      if (decoded.email == userEmail) {
        const conn = MagicDelveConnectionFactory();
        const { token, hostname } = await MagicDelveDBInit();
        const query = `UPDATE User SET email_verified = ?, database_url = ?, database_token = ? WHERE email = ?`;
        const params = [true, hostname, token, userEmail];
        const res = await conn.execute({ sql: query, args: params });
        console.log(res);
        return new NextResponse(
          JSON.stringify({
            success: true,
            message:
              "email verification success, you may close this window and sign-in within the app.",
          }),
          { status: 202, headers: { "content-type": "application/json" } },
        );
      }
    }
    return NextResponse.json(
      JSON.stringify({
        success: false,
        message: `authentication failed: no token`,
      }),
      { status: 401, headers: { "content-type": "application/json" } },
    );
  } catch (err) {
    console.error("Invalid token:", err);
    return new NextResponse(
      JSON.stringify({
        success: false,
        message: "authentication failed: Invalid token",
      }),
      { status: 401, headers: { "content-type": "application/json" } },
    );
  }
}
