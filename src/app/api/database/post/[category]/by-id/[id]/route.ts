import { NextRequest, NextResponse } from "next/server";
import { ConnectionFactory } from "@/app/utils";

export async function GET(
  _: NextRequest,
  context: { params: { category: string; id: string } },
) {
  if (
    context.params.category !== "blog" &&
    context.params.category !== "project"
  ) {
    return NextResponse.json(
      { error: "invalid category value" },
      { status: 400 },
    );
  } else {
    try {
      const conn = ConnectionFactory();
      const query = `
        SELECT Post.*, GROUP_CONCAT(Tag.value) as tags
        FROM Post 
        LEFT JOIN Tag ON Post.id = Tag.post_id
        WHERE Post.id = ?
        GROUP BY Post.id
      `;
      const params = [parseInt(context.params.id)];
      const results = await conn.execute(query, params);
      if (results.rows[0]) {
        return NextResponse.json(
          {
            post: results.rows[0],
          },
          { status: 200 },
        );
      } else {
        return NextResponse.json(
          {
            post: [],
          },
          { status: 204 },
        );
      }
    } catch (e) {
      console.error(e);
      return NextResponse.json({ error: e }, { status: 400 });
    }
  }
}
