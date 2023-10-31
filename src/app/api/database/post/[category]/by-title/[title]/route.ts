import { NextRequest, NextResponse } from "next/server";
import { env } from "@/env.mjs";
import { ConnectionFactory } from "@/app/utils";
import { Post } from "@/types/model-types";

export async function GET(
  request: NextRequest,
  context: { params: { category: string; title: string } },
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
      let privilegeLevel = "anonymous";
      const token = request.cookies.get("userIDToken");
      if (token) {
        if (token.value == env.ADMIN_ID) {
          privilegeLevel = "admin";
        } else {
          privilegeLevel = "user";
        }
      }
      const conn = ConnectionFactory();
      const projectQuery =
        "SELECT * FROM Post WHERE title = ? AND category = ? AND published = ?";
      const projectParams = [
        context.params.title,
        context.params.category,
        true,
      ];
      const projectResults = await conn.execute(projectQuery, projectParams);
      if (projectResults.rows[0]) {
        const post_id = (projectResults.rows[0] as Post).id;

        const commentQuery = "SELECT * FROM Comment WHERE post_id = ?";
        const commentResults = await conn.execute(commentQuery, [post_id]);

        const likeQuery = "SELECT * FROM PostLike WHERE post_id = ?";
        const likeQueryResults = await conn.execute(likeQuery, [post_id]);

        const tagsQuery = "SELECT * FROM Tag WHERE post_id = ?";
        const tagResults = await conn.execute(tagsQuery, [post_id]);

        return NextResponse.json(
          {
            project: projectResults.rows[0],
            comments: commentResults.rows,
            likes: likeQueryResults.rows,
            tagResults: tagResults.rows,
            privilegeLevel: privilegeLevel,
          },
          { status: 200 },
        );
      }
      return NextResponse.json({ status: 200 });
    } catch (e) {
      return NextResponse.json({ error: e }, { status: 400 });
    }
  }
}
