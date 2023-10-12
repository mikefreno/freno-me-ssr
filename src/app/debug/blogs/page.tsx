import { env } from "@/env.mjs";
import { PostWithCommentsAndLikes } from "@/types/model-types";
import { API_RES_GetPrivilegeDependantBlogs } from "@/types/response-types";
import {cookies} from 'next/headers'

export default async function UsersDebugPage() {
  let privilegeLevel: "anonymous" | "admin" | "user" = "anonymous";
  let blogs: PostWithCommentsAndLikes[] = [];
  try {
    const userIDCookie = cookies().get("userIDToken");

    const allProjectQuery = await fetch(
      `${env.NEXT_PUBLIC_DOMAIN}/api/database/blog/privilege-dependant/${
        userIDCookie ? userIDCookie.value : "undefined"
      }`,
      {
        method: "GET",
        cache: "no-store",
      }
    );

    const resData =
      (await allProjectQuery.json()) as API_RES_GetPrivilegeDependantBlogs;
    privilegeLevel = resData.privilegeLevel;

    blogs = resData.rows;
  } catch (e) {
    console.log(e);
    const allProjectQuery = await fetch(
      `${env.NEXT_PUBLIC_DOMAIN}/api/database/blog/privilege-dependant/undefined`,
      { method: "GET", next: { revalidate: 1800 } }
    );
    const resData =
      (await allProjectQuery.json()) as API_RES_GetPrivilegeDependantBlogs;
    privilegeLevel = resData.privilegeLevel;

    blogs = resData.rows;
  }

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
          {blogs.map((blog)=> 
            <div key={blog.id}>
              <div className="grid grid-cols-4 my-2">
                <div>{blog.id}</div>
                <div>{blog.body}</div>
                <div>{blog.attachments}</div>
                <div>{blog.banner_photo}</div>
              </div>
              <hr/>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
