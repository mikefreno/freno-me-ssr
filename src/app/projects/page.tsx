import Card from "@/components/Card";
import LoadingSpinner from "@/components/LoadingSpinner";
import { env } from "@/env.mjs";
import { API_RES_GetPrivilegeDependantProjects } from "@/types/response-types";
import { cookies } from "next/headers";
import Link from "next/link";
import { Suspense } from "react";
import Image from "next/image";

export default async function Projects() {
  const userID = cookies().get("userIDToken")?.value;

  const allProjectQuery = await fetch(
    `${env.NEXT_PUBLIC_DOMAIN}/api/database/project/privilege-dependant/${userID}`,
    { method: "GET", cache: "no-store" }
  );

  const resData =
    (await allProjectQuery.json()) as API_RES_GetPrivilegeDependantProjects;
  const privilegeLevel = resData.privilegeLevel;

  const projects = resData.rows;

  return (
    <>
      <div className="min-h-screen overflow-x-hidden bg-white dark:bg-zinc-900">
        <div className="z-30">
          <div className="page-fade-in z-20 h-80 sm:h-96 md:h-[30vh] mx-auto">
            <div className="fixed w-full h-80 sm:h-96 md:h-[50vh] brightness-75 image-overlay">
              <Image
                src={"/blueprint.jpg"}
                alt="post-cover"
                fill={true}
                quality={100}
                priority={true}
                className="object-cover w-full h-80 sm:h-96 md:h-[50vh]"
              />
            </div>
            <div
              className={`text-shadow fixed top-36 sm:top-48 md:top-[15vh] w-full brightness-150 z-10 select-text text-center tracking-widest text-white`}
              style={{ pointerEvents: "none" }}
            >
              <div className="z-10 font-light tracking-widest text-3xl">
                Projects
              </div>
            </div>
          </div>
        </div>
        <div className="z-40 relative -mt-16 sm:-mt-20 md:mt-0 rounded-lg w-11/12 md:w-3/4 mx-auto min-h-screen shadow-2xl bg-zinc-50 dark:bg-zinc-800 pt-8 pb-24">
          <div>
            {privilegeLevel == "admin" ? (
              <div className="flex justify-end">
                <Link
                  href="/projects/create"
                  className="rounded border mr-4 dark:border-white border-zinc-800 px-4 py-2 dark:hover:bg-zinc-700 hover:bg-zinc-200 active:scale-90 transition-all duration-300 ease-out"
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
              <div className="mx-auto flex w-5/6 md:w-3/4 flex-col">
                {projects.map((project) => (
                  <div key={project.id} className="my-4">
                    <Card
                      project={project}
                      privilegeLevel={privilegeLevel}
                      linkTarget={"projects"}
                    />
                  </div>
                ))}
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
