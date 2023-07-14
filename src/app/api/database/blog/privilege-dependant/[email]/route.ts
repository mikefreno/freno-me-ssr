import { env } from "@/env.mjs";
import { ConnectionFactory } from "@/app/api/database/ConnectionFactory";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  context: { params: { email: string } }
) {
  if (context.params.email !== "undefined") {
    if (context.params.email == env.ADMIN_EMAIL) {
      const conn = ConnectionFactory();
      const blogQuery = "SELECT * FROM Blog";
      const blogParams = [true];
      const blogResults = await conn.execute(blogQuery, blogParams);
      return NextResponse.json(
        { rows: blogResults.rows, privilegeLevel: "admin" },
        { status: 200 }
      );
    } else {
      const conn = ConnectionFactory();
      const query = "SELECT * FROM Blog WHERE Published = ?";
      const params = [true];
      const results = await conn.execute(query, params);
      return NextResponse.json(
        { rows: results.rows, privilegeLevel: "user" },
        { status: 200 }
      );
    }
  } else {
    const conn = ConnectionFactory();
    const query = "SELECT * FROM Blog WHERE published = ?";
    const params = [true];
    const results = await conn.execute(query, params);
    return NextResponse.json(
      { rows: results.rows, privilegeLevel: "anonymous" },
      { status: 200 }
    );
  }
}
