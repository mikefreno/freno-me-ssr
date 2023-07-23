import CommentIcon from "@/icons/CommentIcon";
import { env } from "@/env.mjs";
import Link from "next/link";
import { API_RES_GetBlogWithComments } from "@/types/response-types";
import { cookies } from "next/headers";
import SessionDependantLike from "@/components/SessionDependantLike";
import CommentSection from "@/components/CommentSection";
import { CommentReaction } from "@/types/model-types";
import { Suspense } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import Image from "next/image";

export default async function DynamicBlogPost({
  params,
}: {
  params: { title: string };
}) {
  const blogQuery = await fetch(
    `${env.NEXT_PUBLIC_DOMAIN}/api/database/blog/by-title/${params.title}`,
    {
      method: "GET",
      cache: "no-store",
    }
  );

  const parsedQueryRes =
    (await blogQuery.json()) as API_RES_GetBlogWithComments;

  const currentUserIDCookie = cookies().get("userIDToken");
  const privilegeLevel = currentUserIDCookie
    ? currentUserIDCookie.value == env.ADMIN_ID
      ? "admin"
      : "user"
    : "anonymous";

  const blog = parsedQueryRes.blog[0];

  const comments = parsedQueryRes.comments;
  const topLevelComments = parsedQueryRes.comments.filter(
    (comment) => comment.parent_comment_id == null
  );
  const likes = parsedQueryRes.likes;
  const reactionMap = new Map<number, CommentReaction[]>(
    parsedQueryRes.reactionArray
  );

  if (!blog) {
    return (
      <>
        <div className="pt-[20vh] flex w-full justify-center text-4xl">
          No project found!
        </div>
        <div className="flex justify-center pt-12">
          <Link
            href="/blog"
            className="rounded border text-white shadow-md border-blue-500 bg-blue-400 hover:bg-blue-500 dark: dark:bg-blue-700 dark:hover:bg-blue-800 dark:border-blue-700 active:scale-90 transition-all duration-300 ease-in-out px-4 py-2"
          >
            Back to blog main page
          </Link>
        </div>
      </>
    );
  } else if (blog) {
    return (
      <div className="select-none">
        <div className="z-30 overflow-hidden">
          <div className="page-fade-in z-20 h-72 sm:h-96 md:h-[50vh] mx-auto">
            <div className="fixed w-full h-72 sm:h-96 md:h-[50vh] brightness-75 image-overlay">
              <Image
                src={blog.banner_photo ? blog.banner_photo : "/bitcoin.jpg"}
                alt="post-cover"
                height={400}
                width={600}
                priority={true}
                className="object-cover w-full h-full"
              />
            </div>
            <div
              className={`text-shadow fixed h-32 sm:top-40 md:top-[20vh] w-full brightness-150 z-10 select-text text-center tracking-widest text-white`}
              style={{ pointerEvents: "none" }}
            >
              <div className="z-10 font-light tracking-widest text-3xl">
                {blog.title}
                <div className="py-8 font-light tracking-widest text-xl">
                  {blog.subtitle}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="z-40 relative bg-zinc-100 dark:bg-zinc-800">
          <div className="flex justify-end pr-12 py-4 my-auto">
            <a href="#comments" className="mx-2">
              <div className="flex flex-col tooltip">
                <div className="mx-auto">
                  <CommentIcon strokeWidth={1} height={32} width={32} />
                </div>
                <div
                  className="my-auto pt-0.5 pl-2
              text-black dark:text-white text-sm"
                >
                  {comments.length}{" "}
                  {comments.length == 1 ? "Comment" : "Comments"}
                </div>
                <div className="tooltip-text -ml-[4.5rem]">
                  <div className="px-2 w-fit">Go to Comments</div>
                </div>
              </div>
            </a>
            <div className="mx-2">
              <SessionDependantLike
                currentUserID={currentUserIDCookie?.value}
                privilegeLevel={privilegeLevel}
                likes={likes}
                type={"blog"}
                projectID={blog.id}
              />
            </div>
          </div>
          <div
            className="mx-12 md:mx-28 lg:mx-32 py-8 select-text"
            dangerouslySetInnerHTML={{ __html: blog.body }}
          />
          <div className="mx-4 md:mx-8 lg:mx-12 pb-12">
            <Suspense
              fallback={
                <div className="mx-auto pt-24 w-full">
                  <LoadingSpinner height={48} width={48} />
                </div>
              }
            >
              <CommentSection
                privilegeLevel={privilegeLevel}
                allComments={comments}
                topLevelComments={topLevelComments}
                id={blog.id}
                type={"blog"}
                reactionMap={reactionMap}
                currentUserID={currentUserIDCookie?.value || ""}
              />
            </Suspense>
          </div>
        </div>
      </div>
    );
  }
}
