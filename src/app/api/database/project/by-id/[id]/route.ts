import { NextRequest, NextResponse } from "next/server";
import { ConnectionFactory } from "@/app/api/database/ConnectionFactory";

export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const conn = ConnectionFactory();
    const query = "SELECT * FROM Project WHERE id = ?";
    const params = [parseInt(context.params.id)];
    const results = await conn.execute(query, params);
    if (results.rows[0]) {
      return NextResponse.json(
        {
          project: results.rows[0],
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          project: [],
        },
        { status: 204 }
      );
    }
  } catch (e) {
    return NextResponse.json({ error: e }, { status: 400 });
  }
}
