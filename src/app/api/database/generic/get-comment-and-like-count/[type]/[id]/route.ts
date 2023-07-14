import { ConnectionFactory } from "@/app/api/database/ConnectionFactory";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  context: { params: { type: string; id: string } }
) {
  const conn = ConnectionFactory();
  if (context.params.type === "blog") {
    const commentQuery = "SELECT * FROM Comment WHERE blog_id = ?";
    const params = [context.params.id];
    const commentRes = await conn.execute(commentQuery, params);
    const likeQuery = "SELECT * FROM BlogLike WHERE blog_id = ?";
    const likeRes = await conn.execute(likeQuery, params);
    return NextResponse.json({
      commentCount: commentRes.rows.length,
      likeCount: likeRes.rows.length,
    });
  } else {
    const commentQuery = "SELECT * FROM Comment WHERE project_id  = ?";
    const params = [context.params.id];
    const commentRes = await conn.execute(commentQuery, params);
    const likeQuery = "SELECT * FROM ProjectLike WHERE project_id = ?";
    const likeRes = await conn.execute(likeQuery, params);
    return NextResponse.json({
      commentCount: commentRes.rows.length,
      likeCount: likeRes.rows.length,
    });
  }
}
