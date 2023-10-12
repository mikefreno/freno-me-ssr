import { ConnectionFactory } from "@/app/api/database/ConnectionFactory";
import { NextRequest, NextResponse } from "next/server";

interface InputData {
  body: string;
  comment_id: number;
}

export async function POST(input: NextRequest) {
  const data = (await input.json()) as InputData;
  const { body, comment_id } = data;
  const conn = ConnectionFactory();
  const query = `UPDATE Comment SET body = ? WHERE comment_id = ?`;
  const params = [body, comment_id];
  const res = await conn.execute(query, params);
  return NextResponse.json({ data: res.insertId }, { status: 201 });
}
