import { ConnectionFactory } from "@/app/utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  context: { params: { id: string } },
) {
  try {
    const conn = ConnectionFactory();
    const blogQuery = "SELECT * FROM Blog WHERE id = ?";
    const blogParams = [parseInt(context.params.id)];
    const blogResults = await conn.execute(blogQuery, blogParams);
    if (blogResults.rows[0]) {
      return NextResponse.json(
        {
          blog: blogResults.rows[0],
        },
        { status: 200 },
      );
    } else {
      return NextResponse.json(
        {
          blog: [],
        },
        { status: 204 },
      );
    }
  } catch (e) {
    return NextResponse.json({ error: e }, { status: 400 });
  }
}
