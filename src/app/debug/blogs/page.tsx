import { ConnectionFactory, getPrivilegeLevel } from "@/app/utils";
import { env } from "@/env.mjs";
import { PostWithCommentsAndLikes } from "@/types/model-types";

export default async function UsersDebugPage() {
  if (env.NEXT_PUBLIC_DOMAIN == "http://localhost:3000") {
    let privilegeLevel: "anonymous" | "admin" | "user" = "anonymous";
    privilegeLevel = await getPrivilegeLevel();

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
    if (privilegeLevel != "admin") {
      query += ` WHERE Blog.published = TRUE`;
    }
    query += ` GROUP BY Blog.id, Blog.title, Blog.subtitle, Blog.body, Blog.banner_photo, Blog.date, Blog.published, Blog.author_id, Blog.reads, Blog.attachments;`;
    const conn = ConnectionFactory();
    const results = await conn.execute(query);
    let blogs = results.rows as PostWithCommentsAndLikes[];

    return (
      <>
        <div className="pt-24 mx-12">
          <div className="grid grid-cols-4">
            <div>id</div>
            <div>Body</div>
            <div>Attachments</div>
            <div>Banner</div>
          </div>
          <hr />
          <div>
            {blogs.map((blog) => (
              <div key={blog.id}>
                <div className="grid grid-cols-4 my-2">
                  <div>{blog.id}</div>
                  <div>{blog.body}</div>
                  <div>{blog.attachments}</div>
                  <div>{blog.banner_photo}</div>
                </div>
                <hr />
              </div>
            ))}
          </div>
        </div>
      </>
    );
  }
}
