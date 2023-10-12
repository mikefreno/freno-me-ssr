import { NextResponse } from "next/server";
import { ConnectionFactory } from "@/app/utils";

export async function GET() {
  const conn = ConnectionFactory();
  const userQuery = "SELECT * FROM User";
  const res = await conn.execute(userQuery);
  return NextResponse.json({ users: res.rows }, { status: 200 });
}
