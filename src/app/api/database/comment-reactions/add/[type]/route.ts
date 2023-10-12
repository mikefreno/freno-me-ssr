import { NextRequest, NextResponse } from "next/server";
import { ConnectionFactory } from "@/app/utils";
import { CommentReactionInput } from "@/types/input-types";
import { CommentReaction } from "@/types/model-types";

export async function POST(
  input: NextRequest,
  context: { params: { type: string } },
) {
  const inputData = (await input.json()) as CommentReactionInput;
  const { comment_id, user_id } = inputData;
  const conn = ConnectionFactory();
  const query = `
    INSERT INTO CommentReaction (type, comment_id, user_id)
    VALUES (?, ?, ?)
    `;
  const params = [context.params.type, comment_id, user_id];
  await conn.execute(query, params);
  const followUpQuery = `SELECT * FROM CommentReaction WHERE comment_id = ?`;
  const followUpParams = [comment_id];
  const res = await conn.execute(followUpQuery, followUpParams);
  const data = (res.rows as CommentReaction[]).filter(
    (commentReaction) => commentReaction.comment_id == comment_id,
  );
  return NextResponse.json({ commentReactions: data || [] });
}
