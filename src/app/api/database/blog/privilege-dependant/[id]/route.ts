import { env } from "@/env.mjs";
import { ConnectionFactory } from "@/app/api/database/ConnectionFactory";
import { NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import { cookies } from "next/headers";

export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    let privilegeLevel = "anonymous";
    if (context.params.id !== undefined && context.params.id !== "undefined") {
      try {
        const decoded = await new Promise<JwtPayload | undefined>(
          (resolve, reject) => {
            jwt.verify(
              context.params.id,
              env.JWT_SECRET_KEY,
              (err, decoded) => {
                if (err) {
                  console.log("Failed to authenticate token.");
                  cookies().set({
                    name: "userIDToken",
                    value: "",
                    maxAge: 0,
                    expires: new Date("2016-10-05"),
                  });
                  resolve(undefined);
                } else {
                  resolve(decoded as JwtPayload);
                }
              }
            );
          }
        );

        if (decoded) {
          privilegeLevel = decoded.id === env.ADMIN_ID ? "admin" : "user";
        }
      } catch (e) {
        console.log("An error occurred during JWT verification:", e);
      }
    }

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

    if (privilegeLevel !== "admin") {
      query += ` WHERE Blog.published = TRUE`;
    }
    query += ` GROUP BY Blog.id, Blog.title, Blog.subtitle, Blog.body, Blog.banner_photo, Blog.date, Blog.published, Blog.author_id, Blog.reads, Blog.attachments;`;

    const conn = ConnectionFactory();
    const results = await conn.execute(query);
    return NextResponse.json(
      { rows: results.rows, privilegeLevel: privilegeLevel },
      { status: 200 }
    );
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { rows: [], privilegeLevel: "anonymous" },
      { status: 200 }
    );
  }
}
