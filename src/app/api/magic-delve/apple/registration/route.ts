import { MagicDelveConnectionFactory, MagicDelveDBInit } from "@/app/utils";
import { NextRequest, NextResponse } from "next/server";

import { createClient as createAPIClient } from "@tursodatabase/api";
import { env } from "@/env.mjs";

export async function POST(request: NextRequest) {
  const { email, givenName, lastName, userString } = await request.json();
  if (!userString) {
    return new NextResponse(
      JSON.stringify({
        success: false,
        message: "Missing required fields",
      }),
      { status: 400, headers: { "content-type": "application/json" } },
    );
  }

  const conn = MagicDelveConnectionFactory();

  try {
    // Check if the user exists
    const checkUserQuery = `SELECT * FROM User WHERE apple_user_string = ?${
      email && "OR email = ?"
    }`;
    const checkUserResult = await conn.execute({
      sql: checkUserQuery,
      args: [userString, email],
    });

    if (checkUserResult.rows.length > 0) {
      const setClauses = [];
      const values = [];

      if (email) {
        setClauses.push("email = ?");
        values.push(email);
      }
      if (givenName) {
        setClauses.push("given_name = ?");
        values.push(givenName);
      }
      if (lastName) {
        setClauses.push("family_name = ?");
        values.push(lastName);
      }
      setClauses.push("provider = ?", "apple_user_string = ?");
      values.push("apple", userString);
      const whereClause = `WHERE apple_user_string = ?${
        email && "OR email = ?"
      }`;
      values.push(userString);
      if (email) {
        values.push(email);
      }

      const updateQuery = `UPDATE User SET ${setClauses.join(
        ", ",
      )} ${whereClause}`;
      const updateRes = await conn.execute({
        sql: updateQuery,
        args: values,
      });
      if (updateRes.rowsAffected != 0) {
        return new NextResponse(
          JSON.stringify({
            success: true,
            message: "User information updated",
            email: up,
          }),
          { status: 200, headers: { "content-type": "application/json" } },
        );
      } else {
        return new NextResponse(
          JSON.stringify({
            success: false,
            message: "User update failed!",
          }),
          { status: 418, headers: { "content-type": "application/json" } },
        );
      }
    } else {
      // User doesn't exist, insert new user and init database
      const { token, dbName } = await MagicDelveDBInit();
      try {
        const insertQuery = `
        INSERT INTO User (email, email_verified, given_name, family_name, apple_user_string, provider, database_name, database_token)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;
        await conn.execute({
          sql: insertQuery,
          args: [
            email,
            true,
            givenName,
            lastName,
            userString,
            "apple",
            dbName,
            token,
          ],
        });

        return new NextResponse(
          JSON.stringify({
            success: true,
            message: "New user created",
            dbName,
            dbToken: token,
          }),
          { status: 201, headers: { "content-type": "application/json" } },
        );
      } catch (error) {
        const turso = createAPIClient({
          org: "mikefreno",
          token: env.TURSO_DB_API_TOKEN,
        });
        await turso.databases.delete(dbName);
        console.error(error);
      }
    }
  } catch (error) {
    console.error("Error in Apple Sign-Up handler:", error);
    return new NextResponse(
      JSON.stringify({
        success: false,
        message: "An error occurred while processing the request",
      }),
      { status: 500, headers: { "content-type": "application/json" } },
    );
  }
}
