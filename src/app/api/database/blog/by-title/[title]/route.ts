import { NextRequest, NextResponse } from "next/server";
import { ConnectionFactory } from "@/app/api/database/ConnectionFactory";
import { Blog, Comment, CommentReaction } from "@/types/model-types";

export async function GET(
  request: NextRequest,
  context: { params: { title: string } }
) {
  try {
    const conn = ConnectionFactory();
    const blogQuery = "SELECT * FROM Blog WHERE title = ? AND published = ?";
    const blogParams = [context.params.title, true];
    const blogResults = await conn.execute(blogQuery, blogParams);
    if (blogResults.rows[0]) {
      const commentQuery = "SELECT * FROM Comment WHERE blog_id = ?";
      const commentParams = [(blogResults.rows[0] as Blog).id];
      const commentResults = await conn.execute(commentQuery, commentParams);
      const blogLikesQuery = "SELECT * FROM BlogLike WHERE blog_id = ?";
      const blogLikesResults = await conn.execute(
        blogLikesQuery,
        commentParams
      );
      const reactionArray: [number, CommentReaction[]][] = [];
      for (const comment of commentResults.rows as Comment[]) {
        const reactionQuery =
          "SELECT * FROM CommentReaction WHERE comment_id = ?";
        const reactionParam = [comment.id];
        const res = await conn.execute(reactionQuery, reactionParam);
        reactionArray.push([comment.id, res.rows as CommentReaction[]]);
      }
      return NextResponse.json(
        {
          blog: blogResults.rows,
          comments: commentResults.rows || [],
          likes: blogLikesResults.rows || [],
          reactionArray: reactionArray,
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        blog: [],
        comments: [],
        likes: [],
        reactionMap: [],
      },
      { status: 200 }
    );
  } catch (e) {
    return NextResponse.json({ error: e }, { status: 400 });
  }
}
