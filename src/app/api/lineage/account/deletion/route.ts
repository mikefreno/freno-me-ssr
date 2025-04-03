import { LineageConnectionFactory, validateLineageRequest } from "@/app/utils";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ status: 401, ok: false });
  }

  const auth_token = authHeader.split(" ")[1];
  const { email } = await req.json();

  const conn = LineageConnectionFactory();
  const res = await conn.execute({
    sql: `SELECT * FROM User WHERE email = ?`,
    args: [email],
  });
  const userRow = res.rows[0];
  if (!userRow) {
    return NextResponse.json({ status: 404, ok: false });
  }

  const valid = await validateLineageRequest({ auth_token, email, userRow });
  if (!valid) {
    return NextResponse.json({ status: 401, ok: false });
  } else {
    conn.execute({ sql: `DELETE FROM User WHERE email = ?`, args: [email] });
  }
}
