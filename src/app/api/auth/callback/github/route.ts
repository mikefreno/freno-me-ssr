import { NextRequest, NextResponse } from "next/server";
import { ConnectionFactory } from "../../../database/ConnectionFactory";
import { v4 as uuidV4 } from "uuid";
import { env } from "@/env.mjs";
import { cookies } from "next/headers";
import { User } from "@/types/model-types";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const code = params.get("code");
  if (code) {
    const tokenResponse = await fetch(
      "https://github.com/login/oauth/access_token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          client_id: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          code,
        }),
      }
    );
    const { access_token } = await tokenResponse.json();

    const userResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `token ${access_token}`,
      },
    });

    const user = await userResponse.json();
    const login = user.login;
    const conn = ConnectionFactory();

    const query = `SELECT * FROM User WHERE provider = ? AND display_name = ?`;
    const params = ["github", login];
    const res = await conn.execute(query, params);
    if (res.rows[0]) {
      cookies().set({
        name: "userIDToken",
        value: (res.rows[0] as User).id,
        maxAge: 60 * 60 * 24 * 14,
      });
      if ((res.rows[0] as User).email) {
        cookies().set({
          name: "emailToken",
          value: (res.rows[0] as User).email!,
          maxAge: 60 * 60 * 24 * 14,
        });
      }
    } else {
      const icon = user.avatar_url;
      const email = user.email;
      const userId = uuidV4();

      const insertQuery = `INSERT INTO User (id, email, display_name, provider, image) VALUES (?, ?, ?, ?, ?)`;
      const insertParams = [userId, email, login, "github", icon];
      const insertRes = await conn.execute(insertQuery, insertParams);
      console.log(insertRes);

      cookies().set({
        name: "userIDToken",
        value: userId,
        maxAge: 60 * 60 * 24 * 14,
      });
      if (email) {
        cookies().set({
          name: "emailToken",
          value: email,
          maxAge: 60 * 60 * 24 * 14,
        });
      }
    }

    return NextResponse.redirect(`${env.NEXT_PUBLIC_DOMAIN}/account`);
  } else {
    console.log("no code on callback");
  }
}