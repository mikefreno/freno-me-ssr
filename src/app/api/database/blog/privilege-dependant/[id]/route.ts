import { env } from "@/env.mjs";
import { ConnectionFactory } from "@/app/api/database/ConnectionFactory";
import { NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";

export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    if (context.params.id !== undefined && context.params.id !== "undefined") {
      const decoded = await new Promise<JwtPayload | undefined>(
        (resolve, reject) => {
          jwt.verify(context.params.id, env.JWT_SECRET_KEY, (err, decoded) => {
            if (err) {
              console.log("Failed to authenticate token.");
              reject(err);
            } else {
              resolve(decoded as JwtPayload);
            }
          });
        }
      );

      if (decoded) {
        let query = `
                        SELECT
                            Blog.id,
                            Blog.title,
                            Blog.subtitle,
                            Blog.body,
                            Blog.banner_photo,
                            Blog.date,
                            Blog.published,
                            Blog.author_id,
                            Blog.reads,
                            Blog.attachments,
                        (SELECT COUNT(*) FROM BlogLike WHERE Blog.id = BlogLike.blog_id) AS total_likes,
                        (SELECT COUNT(*) FROM Comment WHERE Blog.id = Comment.blog_id) AS total_comments
                        FROM
                            Blog
                        LEFT JOIN
                            BlogLike ON Blog.id = BlogLike.blog_id
                        LEFT JOIN
                            Comment ON Blog.id = Comment.blog_id`;

        let privilegeLevel = "admin";
        if (decoded.id != env.ADMIN_ID) {
          query += ` WHERE Blog.published = TRUE`;
          privilegeLevel = "user";
        }
        query += ` GROUP BY Blog.id, Blog.title, Blog.subtitle, Blog.body, Blog.banner_photo, Blog.date, Blog.published, Blog.author_id, Blog.reads, Blog.attachments;`;
        const conn = ConnectionFactory();
        const results = await conn.execute(query);
        return NextResponse.json(
          { rows: results.rows, privilegeLevel: privilegeLevel },
          { status: 200 }
        );
      }
    } else {
      const conn = ConnectionFactory();
      const query = `
                SELECT
                    Blog.id,
                    Blog.title,
                    Blog.subtitle,
                    Blog.body,
                    Blog.banner_photo,
                    Blog.date,
                    Blog.published,
                    Blog.author_id,
                    Blog.reads,
                    Blog.attachments,
                (SELECT COUNT(*) FROM BlogLike WHERE Blog.id = BlogLike.blog_id) AS total_likes,
                (SELECT COUNT(*) FROM Comment WHERE Blog.id = Comment.blog_id) AS total_comments
                FROM
                    Blog
                LEFT JOIN
                    BlogLike ON Blog.id = BlogLike.blog_id
                LEFT JOIN
                    Comment ON Blog.id = Comment.blog_id
                WHERE
                    Blog.published = TRUE
                GROUP BY
                    Blog.id, Blog.title, Blog.subtitle, Blog.body, Blog.banner_photo, Blog.date, Blog.published, Blog.author_id, Blog.reads, Blog.attachments;`;
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
