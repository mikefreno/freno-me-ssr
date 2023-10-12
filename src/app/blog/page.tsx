import { env } from "@/env.mjs";
import { cookies } from "next/headers";
import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Blog, PostWithCommentsAndLikes } from "@/types/model-types";
import PostSortingSelect from "@/components/PostSortingSelect";
import PostSorting from "@/components/PostSorting";
import jwt, { JwtPayload } from "jsonwebtoken";
import { ConnectionFactory, getUserIDCookieData } from "../utils";

export default async function Blog() {
  let privilegeLevel: "anonymous" | "admin" | "user" = "anonymous";
  try {
    let cookie = await getUserIDCookieData();
    if (cookie && cookie.value) {
      const decoded = await new Promise<JwtPayload | undefined>(
        (resolve, _) => {
          jwt.verify(
            cookies().get("userIDToken")!.value,
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
            },
          );
        },
      );
      if (decoded) {
        privilegeLevel = decoded.id === env.ADMIN_ID ? "admin" : "user";
      }
    }
  } catch (e) {
    console.log("An error occurred during JWT verification:", e);
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
  if (privilegeLevel != "admin") {
    query += ` WHERE Blog.published = TRUE`;
  }
  query += ` GROUP BY Blog.id, Blog.title, Blog.subtitle, Blog.body, Blog.banner_photo, Blog.date, Blog.published, Blog.author_id, Blog.reads, Blog.attachments;`;
  const conn = ConnectionFactory();
  const results = await conn.execute(query);
  let blogs = results.rows as PostWithCommentsAndLikes[];

  return (
    <>
      <div className="min-h-screen overflow-x-hidden bg-white dark:bg-zinc-900">
        <div className="z-30">
          <div className="page-fade-in z-20 h-80 sm:h-96 md:h-[30vh] mx-auto">
            <div className="fixed w-full h-80 sm:h-96 md:h-[50vh] brightness-75 image-overlay">
              <Image
                src={"/manhattan-night-skyline.jpg"}
                alt="post-cover"
                fill={true}
                quality={100}
                priority={true}
                className="object-cover w-full h-80 sm:h-96 md:h-[50vh]"
              />
            </div>
            <div
              className={`text-shadow fixed top-36 sm:top-44 md:top-[20vh] w-full brightness-150 z-10 select-text text-center tracking-widest text-white`}
              style={{ pointerEvents: "none" }}
            >
              <div className="z-10 font-light tracking-widest text-5xl">
                Blog
              </div>
            </div>
          </div>
        </div>
        <div className="z-40 relative -mt-16 sm:-mt-20 md:mt-0 rounded-t-lg w-11/12 md:w-3/4 mx-auto min-h-screen shadow-2xl bg-zinc-50 dark:bg-zinc-800 pt-8 pb-24">
          <div className="flex md:justify-around md:flex-row flex-col justify-center">
            <div className="flex justify-center md:justify-start">
              <PostSortingSelect type={"blog"} />
            </div>
            {privilegeLevel == "admin" ? (
              <div className="flex justify-center md:justify-end mt-2 md:mt-0">
                <Link
                  href="/blog/create"
                  className="rounded border md:mr-4 dark:border-white border-zinc-800 px-4 py-2 dark:hover:bg-zinc-700 hover:bg-zinc-200 active:scale-90 transition-all duration-300 ease-out"
                >
                  Create Post
                </Link>
              </div>
            ) : null}
          </div>
          <Suspense
            fallback={
              <div className="mx-auto pt-24">
                <LoadingSpinner height={48} width={48} />
              </div>
            }
          >
            {blogs && blogs.length > 0 ? (
              <div className="mx-auto flex w-11/12 flex-col">
                <PostSorting
                  posts={blogs}
                  privilegeLevel={privilegeLevel}
                  type={"blog"}
                />
              </div>
            ) : (
              <div className="text-center">No projects yet!</div>
            )}
          </Suspense>
        </div>
      </div>
    </>
  );
}
