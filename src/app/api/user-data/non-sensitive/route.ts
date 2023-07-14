import { cookies } from "next/headers";
import { ConnectionFactory } from "../../database/ConnectionFactory";
import { NextResponse } from "next/server";
import { User } from "@/types/model-types";
import { env } from "@/env.mjs";

export async function GET() {
  const userIDCookie = cookies().get("userIDToken");
  if (userIDCookie) {
    const conn = ConnectionFactory();
    const userQuery = "SELECT * FROM Users WHERE id =?";
    const userParams = [userIDCookie.value];
    const res = await conn.execute(userQuery, userParams);
    const user = res.rows[0] as User;
    return NextResponse.json(
      {
        email: user.email,
        id: user.id,
        image: user.image,
      },
      { status: 202 }
    );
  } else {
    return NextResponse.json({ status: 200 });
  }
}
