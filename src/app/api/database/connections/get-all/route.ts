import { NextResponse } from "next/server";
import { ConnectionFactory } from "../../ConnectionFactory";

export async function GET() {
  const conn = ConnectionFactory();
  const query = `SELECT * FROM Connection`;
  const res = await conn.execute(query);
  return NextResponse.json({ connections: res.rows });
}
