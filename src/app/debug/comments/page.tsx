import { env } from "@/env.mjs";
import { Comment } from "@/types/model-types";
import { notFound } from "next/navigation";

export default async function UsersDebugPage() {
  if (env.NEXT_PUBLIC_DOMAIN == "http://localhost:3000") {
    const resJSON = await fetch(
      `${env.NEXT_PUBLIC_DOMAIN}/api/database/comments/get-all`,
      { method: "GET", cache: "no-store" },
    );
    const comments = (await resJSON.json()).comments as Comment[];
    return (
      <>
        <div className="pt-24 mx-12">
          <div className="grid grid-cols-6">
            <div>id</div>
            <div>Body</div>
            <div>Blog ID</div>
            <div>Project ID</div>
            <div>Commenter ID</div>
            <div>Parent Comment ID</div>
          </div>
          <hr />
          <div className="grid grid-cols-6">
            {comments.map((comment) => (
              <>
                <div>{comment.id}</div>
                <div>{comment.body}</div>
                <div>{comment.blog_id ? comment.blog_id : "null"}</div>
                <div>{comment.project_id ? comment.project_id : "null"}</div>
                <div className="w-2/3 py-2">{comment.commenter_id}</div>
                <div>
                  {comment.parent_comment_id
                    ? comment.parent_comment_id
                    : "null"}
                </div>
              </>
            ))}
          </div>
        </div>
      </>
    );
  } else {
    return notFound;
  }
}
