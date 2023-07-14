import Card from "@/components/Card";
import Navbar from "@/components/Navbar";
import { env } from "@/env.mjs";
import { API_RES_GPDB } from "@/types/response-types";
import Head from "next/head";
import { cookies } from "next/headers";
import Link from "next/link";

export default async function Blog() {
  const allBlogsQuery = await fetch(
    `${env.NEXT_PUBLIC_DOMAIN}/api/database/blog/privilege-dependant/${
      cookies().get("emailToken")?.value
    }`,
    { method: "GET" }
  );

  const resData = (await allBlogsQuery.json()) as API_RES_GPDB;
  const privilegeLevel = resData.privilegeLevel;
  const blogs = resData.rows;

  return (
    <div className="min-h-screen">
      <div className="h-[30vh] w-full bg-[url('/bitcoin.jpg')] bg-cover bg-center bg-no-repeat">
        <div className="pt-24 text-center text-6xl font-extralight tracking-widest text-white">
          Blog
        </div>
      </div>
      <div className="px-12 py-6">
        {privilegeLevel == "admin" ? (
          <div className="flex justify-end">
            <Link
              href="/blog/create"
              className="rounded border border-black px-4 py-2 text-black dark:border-white dark:text-white dark:hover:bg-white dark:hover:bg-opacity-20 dark:active:bg-opacity-40"
            >
              Create Post
            </Link>
          </div>
        ) : null}
      </div>
      {blogs && blogs.length > 0 ? (
        <div className="mx-auto flex w-3/4 flex-col">
          {blogs.map((blog) => (
            <div key={blog.id} className="my-4">
              <Card
                project={blog}
                privilegeLevel={privilegeLevel}
                linkTarget={"blog"}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center">No blogs yet!</div>
      )}
    </div>
  );
}
