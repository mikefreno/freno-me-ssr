import CommentIcon from "@/icons/CommentIcon";
import { env } from "@/env.mjs";
import Link from "next/link";
import { API_RES_GetProjectWithComments } from "@/types/response-types";
import Image from "next/image";
import { cookies } from "next/headers";
import SessionDependantLike from "@/components/SessionDependantLike";
import CommentSection from "@/components/CommentSection";
import { CommentReaction } from "@/types/model-types";
import { Suspense } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";

export default async function DynamicProjectPost({
  params,
}: {
  params: { title: string };
}) {
  const projectQuery = await fetch(
    `${env.NEXT_PUBLIC_DOMAIN}/api/database/project/by-title/${params.title}`,
    {
      method: "GET",
      cache: "no-store",
    }
  );

  const parsedQueryRes =
    (await projectQuery.json()) as API_RES_GetProjectWithComments;

  const currentUserIDCookie = cookies().get("userIDToken");
  const privilegeLevel = currentUserIDCookie
    ? currentUserIDCookie.value == env.ADMIN_ID
      ? "admin"
      : "user"
    : "anonymous";

  const project = parsedQueryRes.project[0];

  const comments = parsedQueryRes.comments;
  const topLevelComments = parsedQueryRes.comments.filter(
    (comment) => comment.parent_comment_id == null
  );
  const likes = parsedQueryRes.likes;
  const reactionMap = new Map<number, CommentReaction[]>(
    parsedQueryRes.reactionArray
  );

  if (!project) {
    return (
      <>
        <div className="pt-[20vh] flex w-full justify-center text-4xl">
          No project found!
        </div>
        <div className="flex justify-center pt-12">
          <Link
            href="/projects"
            className="rounded border text-white shadow-md border-blue-500 bg-blue-400 hover:bg-blue-500 dark: dark:bg-blue-700 dark:hover:bg-blue-800 dark:border-blue-700 active:scale-90 transition-all duration-300 ease-in-out px-4 py-2"
          >
            Back to project main page
          </Link>
        </div>
      </>
    );
  } else if (project) {
    return (
      <div className="min-h-screen">
        <div className="pb-[400px] relative">
          <Image
            src={project.banner_photo ? project.banner_photo : "/bitcoin.jpg"}
            alt={project.title + " banner"}
            height={400}
            width={600}
            className="w-full max-h-[400px] object-cover object-center absolute z-0"
          />
          <div className="flex flex-col justify-center items-center h-full absolute top-0 left-0 right-0 bottom-0 bg-white bg-opacity-25 backdrop-blur-[px] z-30">
            <h1 className="px-6 md:px-16 lg:px-20 text-shadow pt-4 md:pt-8 font-light tracking-widest text-center text-3xl text-white">
              {project.title}
            </h1>
            <h3 className="px-10 md:px-20 lg:px-28 text-shadow pt-4 font-light tracking-widest text-lg text-center text-white">
              {project.subtitle}
            </h3>
          </div>
        </div>
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
              type={"project"}
              projectID={project.id}
            />
          </div>
        </div>
        <div
          className="px-12 md:px-28 lg:px-32 py-8"
          dangerouslySetInnerHTML={{ __html: project.body }}
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
              id={project.id}
              type={"project"}
              reactionMap={reactionMap}
              currentUserID={currentUserIDCookie?.value || ""}
            />
          </Suspense>
        </div>
      </div>
    );
  }
}
