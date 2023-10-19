import { ConnectionFactory } from "@/app/utils";
import { NextRequest, NextResponse } from "next/server";

interface InputData {
  body: string;
  commentID: number;
}

export async function POST(input: NextRequest) {
  const data = (await input.json()) as InputData;
  const { body, commentID } = data;
  const conn = ConnectionFactory();
  const query = `UPDATE Comment SET body = ? WHERE comment_id = ?`;
  const params = [body, commentID];
  const res = await conn.execute(query, params);
  return NextResponse.json({ data: res.insertId }, { status: 201 });
}
