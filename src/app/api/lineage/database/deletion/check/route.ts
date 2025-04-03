import { LineageConnectionFactory } from "@/app/utils";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  const conn = LineageConnectionFactory();
  const res = await conn.execute({
    sql: `SELECT * FROM cron WHERE email = ?`,
    args: [email],
  });
  const cronRow = res.rows[0];
  if (!cronRow) {
    return NextResponse.json({ status: 404, ok: false });
  }
  return NextResponse.json({
    ok: true,
    status: 200,
    created_at: cronRow.created_at,
  });
}
