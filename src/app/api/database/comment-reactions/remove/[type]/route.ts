import { NextRequest, NextResponse } from "next/server";
import { ConnectionFactory } from "../../../ConnectionFactory";
import { CommentReactionInput } from "@/types/input-types";
import { CommentReaction } from "@/types/model-types";

export async function POST(
  input: NextRequest,
  context: { params: { type: string } }
) {
  const inputData = (await input.json()) as CommentReactionInput;
  const { comment_id, user_id } = inputData;
  const conn = ConnectionFactory();
  const query = `
    DELETE FROM CommentReaction
    WHERE type = ? AND comment_id = ? AND user_id = ?
    `;
  const params = [context.params.type, comment_id, user_id];
  const res = await conn.execute(query, params);
  const data = (res.rows as CommentReaction[]).filter(
    (commentReaction) => commentReaction.comment_id == comment_id
  );
  return NextResponse.json({ commentReactions: data });
}
