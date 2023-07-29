import { env } from "@/env.mjs";
import { ConnectionFactory } from "@/app/api/database/ConnectionFactory";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    if (context.params.id !== ("undefined" || undefined)) {
      if (context.params.id == env.ADMIN_ID) {
        const conn = ConnectionFactory();
        const query = `
    SELECT
        Project.id,
        Project.title,
        Project.subtitle,
        Project.body,
        Project.banner_photo,
        Project.date,
        Project.published,
        Project.author_id,
        Project.reads,
        Project.attachments,
    (SELECT COUNT(*) FROM ProjectLike WHERE Project.id = ProjectLike.project_id) AS total_likes,
    (SELECT COUNT(*) FROM Comment WHERE Project.id = Comment.project_id) AS total_comments
    FROM
        Project
    LEFT JOIN
        ProjectLike ON Project.id = ProjectLike.project_id
    LEFT JOIN
        Comment ON Project.id = Comment.project_id
    GROUP BY
        Project.id, Project.title, Project.subtitle, Project.body, Project.banner_photo, Project.date, Project.published, Project.author_id, Project.reads, Project.attachments;`;
        const results = await conn.execute(query);
        return NextResponse.json(
          { rows: results.rows, privilegeLevel: "admin" },
          { status: 200 }
        );
      } else {
        const conn = ConnectionFactory();
        const query = `
    SELECT
        Project.id,
        Project.title,
        Project.subtitle,
        Project.body,
        Project.banner_photo,
        Project.date,
        Project.published,
        Project.author_id,
        Project.reads,
        Project.attachments,
    (SELECT COUNT(*) FROM ProjectLike WHERE Project.id = ProjectLike.project_id) AS total_likes,
    (SELECT COUNT(*) FROM Comment WHERE Project.id = Comment.project_id) AS total_comments
    FROM
        Project
    LEFT JOIN
        ProjectLike ON Project.id = ProjectLike.project_id
    LEFT JOIN
        Comment ON Project.id = Comment.project_id
    WHERE
        Project.published = TRUE;
    GROUP BY
        Project.id, Project.title, Project.subtitle, Project.body, Project.banner_photo, Project.date, Project.published, Project.author_id, Project.reads, Project.attachments;`;
        const results = await conn.execute(query);
        return NextResponse.json(
          { rows: results.rows, privilegeLevel: "user" },
          { status: 200 }
        );
      }
    } else {
      const conn = ConnectionFactory();
      const query = `
    SELECT
        Project.id,
        Project.title,
        Project.subtitle,
        Project.body,
        Project.banner_photo,
        Project.date,
        Project.published,
        Project.author_id,
        Project.reads,
        Project.attachments,
    (SELECT COUNT(*) FROM ProjectLike WHERE Project.id = ProjectLike.project_id) AS total_likes,
    (SELECT COUNT(*) FROM Comment WHERE Project.id = Comment.project_id) AS total_comments
    FROM
        Project
    LEFT JOIN
        ProjectLike ON Project.id = ProjectLike.project_id
    LEFT JOIN
        Comment ON Project.id = Comment.project_id
    WHERE
        Project.published = TRUE;
    GROUP BY
        Project.id, Project.title, Project.subtitle, Project.body, Project.banner_photo, Project.date, Project.published, Project.author_id, Project.reads, Project.attachments;`;
      const results = await conn.execute(query);
      return NextResponse.json(
        { rows: results.rows, privilegeLevel: "anonymous" },
        { status: 200 }
      );
    }
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { rows: [], privilegeLevel: "anonymous" },
      { status: 200 }
    );
  }
}
