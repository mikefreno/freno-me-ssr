import { ConnectionFactory } from "@/app/api/database/ConnectionFactory";
import { User } from "@/types/model-types";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  const conn = ConnectionFactory();
  const query = "SELECT * FROM User WHERE id = ?";
  const params = [context.params.id];
  const results = await conn.execute(query, params);
  return NextResponse.json({ user: results.rows[0] }, { status: 200 });
}
