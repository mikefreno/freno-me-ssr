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
      <div className="mx-8 min-h-screen py-20">
        <div className="flex justify-between">
          <div className="flex flex-col">
            <h1 className="pl-24 pt-8 font-light tracking-widest">
              {blog.title}
            </h1>
            <h3 className="pl-32 font-light tracking-widest">
              {blog.subtitle}
            </h3>
          </div>
          <div className="flex my-auto">
            <a href="#comments" className="mx-2">
              <div className="flex flex-col tooltip">
                <div className="mx-auto">
                  <CommentIcon strokeWidth={1} height={32} width={32} />
                </div>
                <div className="mx-auto">{comments.length} Comments</div>
                <div className="tooltip-text">Go to Comments</div>
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
            className="w-3/4 max-h-[300px] object-cover object-center mx-auto"
          />
        </div>
        <div
          className="px-24 py-4"
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
