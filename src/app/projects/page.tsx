import LoadingSpinner from "@/components/LoadingSpinner";
import Link from "next/link";
import { Suspense } from "react";
import Image from "next/image";
import { PostWithCommentsAndLikes } from "@/types/model-types";
import PostSortingSelect from "@/components/PostSortingSelect";
import PostSorting from "@/components/PostSorting";
import { ConnectionFactory, getPrivilegeLevel } from "../utils";

export default async function Projects() {
  let privilegeLevel: "anonymous" | "admin" | "user" = "anonymous";
  privilegeLevel = await getPrivilegeLevel();
  let query = `
    SELECT
        Project.id,
        Project.title,
        Project.subtitle,
        Project.body,
        Project.banner_photo,
        Project.date,
        Project.published,
        Project.author_id,
        Project.reads,
        Project.attachments,
    (SELECT COUNT(*) FROM ProjectLike WHERE Project.id = ProjectLike.project_id) AS total_likes,
    (SELECT COUNT(*) FROM Comment WHERE Project.id = Comment.project_id) AS total_comments
    FROM
        Project
    LEFT JOIN
        ProjectLike ON Project.id = ProjectLike.project_id
    LEFT JOIN
        Comment ON Project.id = Comment.project_id`;
  if (privilegeLevel != "admin") {
    query += ` WHERE Project.published = TRUE`;
  } else {
    privilegeLevel = "admin";
  }
  query += ` GROUP BY Project.id, Project.title, Project.subtitle, Project.body, Project.banner_photo, Project.date, Project.published, Project.author_id, Project.reads, Project.attachments;`;
  const conn = ConnectionFactory();
  const results = await conn.execute(query);
  let projects = results.rows as PostWithCommentsAndLikes[];

  return (
    <>
      <div className="min-h-screen overflow-x-hidden bg-white dark:bg-zinc-900">
        <div className="z-30">
          <div className="page-fade-in z-20 mx-auto h-80 sm:h-96 md:h-[30vh]">
            <div className="image-overlay fixed h-80 w-full brightness-75 sm:h-96 md:h-[50vh]">
              <Image
                src={"/blueprint.jpg"}
                alt="post-cover"
                fill={true}
                quality={100}
                priority={true}
                className="h-80 w-full object-cover sm:h-96 md:h-[50vh]"
              />
            </div>
            <div
              className={`text-shadow fixed top-36 sm:top-48 md:top-[15vh] w-full brightness-150 z-10 select-text text-center tracking-widest text-white`}
              style={{ pointerEvents: "none" }}
            >
              <div className="z-10 text-5xl font-light tracking-widest">
                Projects
              </div>
            </div>
          </div>
        </div>
        <div className="relative z-40 mx-auto -mt-16 min-h-screen w-11/12 rounded-t-lg bg-zinc-50 pb-24 pt-8 shadow-2xl dark:bg-zinc-800 sm:-mt-20 md:mt-0 md:w-5/6 lg:w-3/4">
          <div className="flex flex-col justify-center md:flex-row md:justify-around">
            <div className="flex justify-center md:justify-start">
              <PostSortingSelect type={"projects"} />
            </div>
            {privilegeLevel == "admin" ? (
              <div className="mt-2 flex justify-center md:mt-0 md:justify-end">
                <Link
                  href="/projects/create"
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
            {projects && projects.length > 0 ? (
              <div className="mx-auto flex w-11/12 flex-col">
                <PostSorting
                  posts={projects}
                  privilegeLevel={privilegeLevel}
                  type={"projects"}
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
