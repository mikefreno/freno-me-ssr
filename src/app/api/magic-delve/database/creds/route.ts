import { env } from "@/env.mjs";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { MagicDelveConnectionFactory } from "@/app/utils";
import { OAuth2Client } from "google-auth-library";
const CLIENT_ID = env.NEXT_PUBLIC_GOOGLE_CLIENT_ID_MAGIC_DELVE;

const client = new OAuth2Client(CLIENT_ID);

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return new NextResponse(JSON.stringify({ valid: false }), { status: 401 });
  }
  const { email, provider } = await req.json();
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
    let valid_request = false;
    if (provider == "email") {
      const decoded = jwt.verify(token, env.JWT_SECRET_KEY) as jwt.JwtPayload;
      if (decoded.email == email) {
        valid_request = true;
      }
    } else if (provider == "google") {
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID,
      });
      if (ticket.getPayload()?.email == email) {
        valid_request = true;
      }
    } else {
      const conn = MagicDelveConnectionFactory();
      const query = "SELECT * FROM User WHERE apple_user_string = ?";
      const res = await conn.execute({ sql: query, args: [token] });
      if (res.rows.length > 0 && res.rows[0] && res.rows[0].email == email) {
        valid_request = true;
      }
    }

    if (valid_request) {
      const conn = MagicDelveConnectionFactory();
      const query = "SELECT * FROM User WHERE email = ? LIMIT 1";
      const params = [email];
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
