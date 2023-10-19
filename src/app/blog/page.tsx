import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Blog, PostWithCommentsAndLikes } from "@/types/model-types";
import PostSortingSelect from "@/components/PostSortingSelect";
import PostSorting from "@/components/PostSorting";
import { ConnectionFactory, getPrivilegeLevel } from "../utils";

export default async function Blog() {
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
      <div className="min-h-screen overflow-x-hidden bg-white dark:bg-zinc-900">
        <div className="z-30">
          <div className="page-fade-in z-20 mx-auto h-80 sm:h-96 md:h-[30vh]">
            <div className="image-overlay fixed h-80 w-full brightness-75 sm:h-96 md:h-[50vh]">
              <Image
                src={"/manhattan-night-skyline.jpg"}
                alt="post-cover"
                fill={true}
                quality={100}
                priority={true}
                className="h-80 w-full object-cover sm:h-96 md:h-[50vh]"
              />
            </div>
            <div
              className={`text-shadow fixed top-36 sm:top-44 md:top-[20vh] w-full brightness-150 z-10 select-text text-center tracking-widest text-white`}
              style={{ pointerEvents: "none" }}
            >
              <div className="z-10 text-5xl font-light tracking-widest">
                Blog
              </div>
            </div>
          </div>
        </div>
        <div className="relative z-40 mx-auto -mt-16 min-h-screen w-11/12 rounded-t-lg bg-zinc-50 pb-24 pt-8 shadow-2xl dark:bg-zinc-800 sm:-mt-20 md:mt-0 md:w-3/4">
          <div className="flex flex-col justify-center md:flex-row md:justify-around">
            <div className="flex justify-center md:justify-start">
              <PostSortingSelect type={"blog"} />
            </div>
            {privilegeLevel == "admin" ? (
              <div className="mt-2 flex justify-center md:mt-0 md:justify-end">
                <Link
                  href="/blog/create"
                  className="rounded border border-zinc-800 px-4 py-2 transition-all duration-300 ease-out hover:bg-zinc-200 active:scale-90 dark:border-white dark:hover:bg-zinc-700 md:mr-4"
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
