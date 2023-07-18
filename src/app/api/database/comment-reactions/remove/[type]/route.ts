import { NextRequest, NextResponse } from "next/server";
import { ConnectionFactory } from "../../../ConnectionFactory";

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
  return NextResponse.json({ res: res });
}
