import { cookies } from "next/headers";
import { ConnectionFactory } from "../../database/ConnectionFactory";
import { NextRequest, NextResponse } from "next/server";
import { User } from "@/types/model-types";
import { env } from "@/env.mjs";

export async function GET(request: NextRequest) {
  try {
    const userIDCookie = request.cookies.get("userIDToken");

    if (userIDCookie) {
      const conn = ConnectionFactory();
      const userQuery = "SELECT * FROM User WHERE id =?";
      const userParams = [userIDCookie.value];
      const res = await conn.execute(userQuery, userParams);
      const user = res.rows[0] as User;
      return NextResponse.json(
        {
          id: user.id,
          email: user.email,
          emailVerified: user.email_verified,
          image: user.image,
          displayName: user.display_name,
          provider: user.provider,
        },
        { status: 202 }
      );
    } else {
      return NextResponse.json({ status: 200 });
    }
  } catch (err) {
    console.log(err);
    return NextResponse.json({ status: 200 });
  }
}
