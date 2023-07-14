import { NextRequest, NextResponse } from "next/server";

import { Project } from "@/types/model-types";
import { env } from "@/env.mjs";
import { ConnectionFactory } from "@/app/api/database/ConnectionFactory";

export async function GET(
  request: NextRequest,
  context: { params: { title: string } }
) {
  let permissionLevel = "anonymous";
  const token = request.cookies.get("userIDToken");
  if (token) {
    if (token.value == env.ADMIN_ID) {
      permissionLevel = "admin";
    } else {
      permissionLevel = "user";
    }
  }
  const conn = ConnectionFactory();
  const projectQuery =
    "SELECT * FROM Project WHERE title = ? AND published = ?";
  const projectParams = [context.params.title, true];
  const projectResults = await conn.execute(projectQuery, projectParams);

  const commentQuery = "SELECT * FROM Comment WHERE project_id = ?";
  const commentParams = [(projectResults.rows[0] as Project).id];
  const commentResults = await conn.execute(commentQuery, commentParams);

  return NextResponse.json(
    {
      project: projectResults.rows[0],
      comments: commentResults.rows,
      permissionLevel: permissionLevel,
    },
    { status: 200 }
  );
}
