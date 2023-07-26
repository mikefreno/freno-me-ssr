import { ConnectionFactory } from "@/app/api/database/ConnectionFactory";
import { env } from "@/env.mjs";
import { NextRequest, NextResponse } from "next/server";

export default async function POST(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const cookie = request.cookies.get("userIDToken");
  if (cookie && cookie.value == env.ADMIN_ID) {
    try {
      const conn = ConnectionFactory();
      const query = `DELETE FROM Project WHERE id = ?`;
      const params = [parseInt(context.params.id)];
      const res = await conn.execute(query, params);
      return NextResponse.json({ res: res }, { status: 200 });
    } catch (e) {
      return NextResponse.json({ res: "failure", error: e }, { status: 500 });
    }
  } else {
    return NextResponse.json(
      { res: "unauthorized", error: "unauthorized" },
      { status: 401 }
    );
  }
}
