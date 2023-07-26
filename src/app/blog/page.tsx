import Card from "@/components/Card";
import { env } from "@/env.mjs";
import { API_RES_GetPrivilegeDependantBlogs } from "@/types/response-types";
import { cookies } from "next/headers";
import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";

export default async function Blog() {
  const allBlogsQuery = await fetch(
    `${env.NEXT_PUBLIC_DOMAIN}/api/database/blog/privilege-dependant/${
      cookies().get("emailToken")?.value
    }`,
    { method: "GET" }
  );

  const resData =
    (await allBlogsQuery.json()) as API_RES_GetPrivilegeDependantBlogs;
  const privilegeLevel = resData.privilegeLevel;
  const blogs = resData.rows;

  return (
    <>
      <div className="min-h-screen overflow-x-hidden">
        <div className="z-30">
          <div className="page-fade-in z-20 h-80 sm:h-96 md:h-[30vh] mx-auto">
            <div className="fixed w-full h-80 sm:h-96 md:h-[50vh] brightness-75 image-overlay">
              <Image
                src={"/manhattan-night-skyline.jpg"}
                alt="post-cover"
                height={1000}
                width={1000}
                quality={100}
                priority={true}
                className="object-cover w-full h-80 sm:h-96 md:h-[50vh]"
              />
            </div>
            <div
              className={`text-shadow fixed top-36 sm:top-44 md:top-[20vh] w-full brightness-150 z-10 select-text text-center tracking-widest text-white`}
              style={{ pointerEvents: "none" }}
            >
              <div className="z-10 font-light tracking-widest text-3xl">
                Projects
              </div>
            </div>
          </div>
        </div>
        <div className="z-40 relative bg-zinc-100 dark:bg-zinc-800 pt-8 pb-24">
          <div>
            {privilegeLevel == "admin" ? (
              <div className="flex justify-end">
                <Link
                  href="/blog/create"
                  className="rounded border dark:border-white border-zinc-800 px-4 py-2 dark:hover:bg-zinc-700 hover:bg-zinc-200 active:scale-90 transition-all duration-300 ease-out"
                >
                  Create Post
                </Link>
              </div>
            ) : null}
          </div>
          {blogs && blogs.length > 0 ? (
            <div className="mx-auto flex w-5/6 md:w-3/4 flex-col">
              {blogs.map((blog) => (
                <div key={blog.id} className="my-4">
                  <Suspense
                    fallback={
                      <div className="mx-auto pt-24">
                        <LoadingSpinner height={48} width={48} />
                      </div>
                    }
                  >
                    <Card
                      project={blog}
                      privilegeLevel={privilegeLevel}
                      linkTarget={"blog"}
                    />
                  </Suspense>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center">No blogs yet!</div>
          )}
        </div>
      </div>
    </>
  );
}
