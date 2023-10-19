import { ConnectionFactory } from "@/app/utils";
import { NextRequest, NextResponse } from "next/server";

interface InputData {
  body: string;
  parentCommentID: number;
  commenterID: string;
}

export async function POST(
  input: NextRequest,
  context: { params: { type: string; post_id: string } },
) {
  try {
    const data = (await input.json()) as InputData;
    const { body, parentCommentID, commenterID } = data;
    const conn = ConnectionFactory();
    const query = `
    INSERT INTO Comment (body, ${context.params.type}_id, parent_comment_id, commenter_id)
    VALUES (?, ?, ?, ?)
    `;
    const params = [
      body,
      parseInt(context.params.post_id),
      parentCommentID,
      commenterID,
    ];
    const res = await conn.execute(query, params);
    return NextResponse.json({ data: res.insertId }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: e }, { status: 500 });
  }
}
