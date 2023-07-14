import { NextRequest, NextResponse } from "next/server";
import { env } from "@/env.mjs";
import { ConnectionFactory } from "@/app/api/database/ConnectionFactory";
import { Blog } from "@/types/model-types";

export async function GET(
  request: NextRequest,
  context: { params: { title: string } }
) {
  let privilegeLevel = "anonymous";
  const token = request.cookies.get("userIDToken");
  if (token) {
    if (token.value == env.ADMIN_ID) {
      privilegeLevel = "admin";
    } else {
      privilegeLevel = "user";
    }
  }
  const conn = ConnectionFactory();
  const blogQuery = "SELECT * FROM Blog WHERE title = ? AND published = ?";
  const blogParams = [context.params.title, true];
  const blogResults = await conn.execute(blogQuery, blogParams);
  if (blogResults.rows[0]) {
    const commentQuery = "SELECT * FROM Comment WHERE blog_id = ?";
    const commentParams = [(blogResults.rows[0] as Blog).id];
    const commentResults = await conn.execute(commentQuery, commentParams);

    return NextResponse.json(
      {
        blog: blogResults.rows[0],
        comments: commentResults.rows,
        privilegeLevel: privilegeLevel,
      },
      { status: 302 }
    );
  }

  return NextResponse.json(
    {
      blog: blogResults.rows[0],
      comments: [],
      privilegeLevel: privilegeLevel,
    },
    { status: 302 }
  );
}
