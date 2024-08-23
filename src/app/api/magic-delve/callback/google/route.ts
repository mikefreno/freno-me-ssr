import { NextRequest, NextResponse } from "next/server";
import { env } from "@/env.mjs";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import { MagicDelveConnectionFactory, MagicDelveDBInit } from "@/app/utils";

const client = new OAuth2Client(env.NEXT_PUBLIC_GOOGLE_CLIENT_ID_MAGIC_DELVE);

export async function POST(request: NextRequest) {
  try {
    const { idToken } = await request.json();

    const ticket = await client.verifyIdToken({
      idToken,
      audience: env.NEXT_PUBLIC_GOOGLE_CLIENT_ID_MAGIC_DELVE,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      throw new Error("Invalid token payload");
    }

    const { email, name, picture } = payload;
    if (!email) return NextRequest;

    const conn = MagicDelveConnectionFactory();

    // Check if user exists
    const res = await conn.execute({
      sql: "SELECT * FROM User WHERE email = ?",
      args: [email],
    });
    const existingUser = res.rows.length > 0 ? res.rows[0] : null;

    let userId: string | undefined;
    let dbName: string | undefined;
    let dbToken: string | undefined;

    if (!existingUser) {
      // Create new user
      const { token, dbName: newDbName } = await MagicDelveDBInit();
      dbName = newDbName;
      dbToken = token;

      const insertQuery = `
        INSERT INTO User (email, email_verified, provider, image, database_url, database_token)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      const result = await conn.execute({
        sql: insertQuery,
        args: [
          email,
          true,
          "google",
          name ?? null,
          picture ?? null,
          dbName,
          dbToken,
        ],
      });
      userId = result.rows[0].id?.toString();
    } else {
      // Update existing user
      userId = existingUser.id?.toString();
      dbName = existingUser.database_url?.toString();
      dbToken = existingUser.database_token?.toString();

      const updateQuery = `
        UPDATE User 
        SET name = ?, profile_picture = ?, email_verified = TRUE
        WHERE email = ?
      `;
      await conn.execute({
        sql: updateQuery,
        args: [name ?? null, picture ?? null, email],
      });
    }

    // Create a custom JWT
    const customToken = jwt.sign(
      { userId, email, dbName, dbToken },
      env.JWT_SECRET_KEY,
      { expiresIn: "7d" },
    );

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Google authentication successful",
        token: customToken,
        user: { id: userId, email, name, picture },
      }),
      { status: 200, headers: { "content-type": "application/json" } },
    );
  } catch (error) {
    console.error("Google authentication error:", error);
    return new NextResponse(
      JSON.stringify({
        success: false,
        message: "Authentication failed",
      }),
      { status: 401, headers: { "content-type": "application/json" } },
    );
  }
}
