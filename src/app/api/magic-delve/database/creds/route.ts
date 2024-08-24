import { env } from "@/env.mjs";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { MagicDelveConnectionFactory } from "@/app/utils";

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return new NextResponse(JSON.stringify({ valid: false }), { status: 401 });
  }
  const { email } = await req.json();
  if (!email) {
    return new NextResponse(
      JSON.stringify({ success: false, message: "missing email in body" }),
      {
        status: 401,
      },
    );
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET_KEY) as jwt.JwtPayload;

    if (decoded.email == email) {
      const conn = MagicDelveConnectionFactory();
      const query = "SELECT * FROM User WHERE email = ? LIMIT 1";
      const params = [decoded.email];
      const res = await conn.execute({ sql: query, args: params });
      if (res.rows.length === 1) {
        const user = res.rows[0];
        return new NextResponse(
          JSON.stringify({
            success: false,
            db_url: user.database_url,
            db_token: user.database_token,
          }),
          { status: 200 },
        );
      }
      return new NextResponse(JSON.stringify({ success: false }), {
        status: 401,
      });
    } else {
      return new NextResponse(
        JSON.stringify({ success: false, message: "destroy token" }),
        {
          status: 401,
        },
      );
    }
  } catch (error) {
    return new NextResponse(JSON.stringify({ success: false }), {
      status: 401,
    });
  }
}
