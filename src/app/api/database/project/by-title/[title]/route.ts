import { NextRequest, NextResponse } from "next/server";
import { env } from "@/env.mjs";
import { ConnectionFactory } from "@/app/utils";
import { Project } from "@/types/model-types";

export async function GET(
  request: NextRequest,
  context: { params: { title: string } },
) {
  try {
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
    const projectQuery =
      "SELECT * FROM Project WHERE title = ? AND published = ?";
    const projectParams = [context.params.title, true];
    const projectResults = await conn.execute(projectQuery, projectParams);
    if (projectResults.rows[0]) {
      const commentQuery = "SELECT * FROM Comment WHERE project_id = ?";
      const commentParams = [(projectResults.rows[0] as Project).id];
      const commentResults = await conn.execute(commentQuery, commentParams);
      const projectLikeQuery = "SELECT * FROM ProjectLike WHERE project_id = ?";
      const projectLikeResults = await conn.execute(
        projectLikeQuery,
        commentParams,
      );
      return NextResponse.json(
        {
          project: projectResults.rows,
          comments: commentResults.rows,
          likes: projectLikeResults.rows,
          privilegeLevel: privilegeLevel,
        },
        { status: 200 },
      );
    }

    return NextResponse.json(
      {
        project: projectResults.rows,
        comments: [],
        likes: [],
        privilegeLevel: privilegeLevel,
      },
      { status: 200 },
    );
  } catch (e) {
    return NextResponse.json({ error: e }, { status: 400 });
  }
}
