import { NextRequest, NextResponse } from "next/server";
import { ConnectionFactory } from "../../ConnectionFactory";

export async function GET(context: { params: { commentID: string } }) {
  const commentID = context.params.commentID;
  const conn = ConnectionFactory();
  const commentQuery = "SELECT * FROM CommentReaction WHERE comment_id = ?";
  const commentParams = [commentID];
  const commentResults = await conn.execute(commentQuery, commentParams);
  return NextResponse.json(
    { commentReactions: commentResults.rows },
    { status: 202 }
  );
}
