import CommentIcon from "@/icons/CommentIcon";
import { env } from "@/env.mjs";
import Link from "next/link";
import { API_RES_GetBlogWithComments } from "@/types/response-types";
import Image from "next/image";
import { cookies } from "next/headers";
import SessionDependantLike from "@/components/SessionDependantLike";
import CommentSection from "@/components/CommentSection";
import { CommentReaction } from "@/types/model-types";
import { Suspense } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";

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
      <div className="mx-4 md:mx-8 min-h-screen py-20">
        <div className="flex justify-between">
          <div className="flex flex-col">
            <h1 className="pl-6 md:pl-16 lg:pl-20 pt-4 md:pt-8 font-light tracking-widest">
              {blog.title}
            </h1>
            <h3 className="pl-10 md:pl-20 lg:pl-28 pt-4 font-light tracking-widest">
              {blog.subtitle}
            </h3>
          </div>
          <div className="flex my-auto">
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
        </div>
        <div>
          <Image
            src={
              blog.banner_photo
                ? env.NEXT_PUBLIC_AWS_BUCKET_STRING + blog.banner_photo
                : "/blueprint.jpg"
            }
            alt={blog.title + " banner"}
            height={300}
            width={300}
            className="w-11/12 md:w-3/4 max-h-[300px] object-cover object-center mx-auto"
          />
        </div>
        <div
          className="px-8 md:px-24 py-4"
          dangerouslySetInnerHTML={{ __html: blog.body }}
        />
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
    );
  }
}
