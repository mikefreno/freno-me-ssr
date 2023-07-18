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
    INSERT INTO CommentReaction (type, comment_id, user_id)
    VALUES (?, ?, ?)
    `;
  const params = [context.params.type, comment_id, user_id];
  const res = await conn.execute(query, params);
  return NextResponse.json({ res: res });
}
