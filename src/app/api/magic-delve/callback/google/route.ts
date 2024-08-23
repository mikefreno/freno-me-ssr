import { NextRequest, NextResponse } from "next/server";
import { env } from "@/env.mjs";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import { MagicDelveConnectionFactory, MagicDelveDBInit } from "@/app/utils";
import { createClient as createAPIClient } from "@tursodatabase/api";

const client = new OAuth2Client(env.NEXT_PUBLIC_GOOGLE_CLIENT_ID_MAGIC_DELVE);

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const { idToken } = await request.json();
    if (!idToken) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 },
      );
    }

    const ticket = await client.verifyIdToken({
      idToken,
      audience: env.NEXT_PUBLIC_GOOGLE_CLIENT_ID_MAGIC_DELVE,
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      throw new Error("Invalid token payload or missing email");
    }

    const { email, picture } = payload;

    const conn = MagicDelveConnectionFactory();

    // Check if user exists
    const res = await conn.execute({
      sql: "SELECT * FROM User WHERE email = ?",
      args: [email],
    });
    const existingUser = res.rows.length > 0 ? res.rows[0] : null;

    let userId: string;
    let dbName: string;
    let dbToken: string;

    if (!existingUser) {
      // Create new user
      const { token, dbName: newDbName } = await MagicDelveDBInit();
      dbName = newDbName;
      dbToken = token;

      try {
        const insertQuery = `
          INSERT INTO User (email, email_verified, provider, image, database_url, database_token)
          VALUES (?, ?, ?, ?, ?, ?)
        `;

        await conn.execute({
          sql: insertQuery,
          args: [email, true, "google", picture ?? null, dbName, dbToken],
        });

        const followup_query = `SELECT * FROM User WHERE provider = ? AND email = ?`;
        const params = ["google", email];
        const res = await conn.execute({ sql: followup_query, args: params });
        if (res.rows.length == 0) {
          return NextResponse.json(
            {
              success: false,
              message: "server failure in database response",
            },
            { status: 500 },
          );
        }
        const id = res.rows[0].id?.toString();
        if (!id) {
          throw new Error("Failed to insert new user");
        }
        userId = id;
      } catch (insertError) {
        const turso = createAPIClient({
          org: "mikefreno",
          token: env.TURSO_DB_API_TOKEN,
        });
        await turso.databases.delete(dbName);
        throw insertError;
      }
    } else {
      // Update existing user
      userId = existingUser.id?.toString() ?? "";
      dbName = existingUser.database_url?.toString() ?? "";
      dbToken = existingUser.database_token?.toString() ?? "";

      const updateQuery = `
        UPDATE User 
        SET  image = ?, email_verified = TRUE
        WHERE email = ?
      `;
      await conn.execute({
        sql: updateQuery,
        args: [picture ?? null, email],
      });
    }

    const customToken = jwt.sign({ userId, email }, env.JWT_SECRET_KEY, {
      expiresIn: "7d",
    });

    return NextResponse.json(
      {
        success: true,
        message: "Google authentication successful",
        token: customToken,
        user: { id: userId, email, picture },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Google authentication error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Authentication failed",
      },
      { status: 401 },
    );
  }
}
