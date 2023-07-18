import { ConnectionFactory } from "@/app/api/database/ConnectionFactory";
import { PostLikeInput } from "@/types/input-types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(input: NextRequest) {
  const inputData = (await input.json()) as PostLikeInput;
  const { user_id, post_id, post_type } = inputData;
  const conn = ConnectionFactory();
  const query = `INSERT INTO ${post_type}Like (user_id, ${post_type.toLowerCase()}_id)
    VALUES (?, ?)`;
  const params = [user_id, post_id];
  const res = await conn.execute(query, params);
  return NextResponse.json({ newLikes: res.rows });
}
