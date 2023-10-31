import { getPrivilegeLevel } from "@/app/utils";
import EditingClient from "@/components/EditingClient";
import LoadingSpinner from "@/components/LoadingSpinner";
import { env } from "@/env.mjs";
import { Post, Tag } from "@/types/model-types";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function ProjectEditing({
  params,
}: {
  params: { id: string };
}) {
  const privilegeLevel = await getPrivilegeLevel();
  if (privilegeLevel == "admin") {
    const res = await fetch(
      `${env.NEXT_PUBLIC_DOMAIN}/api/database/post/blog/by-id/${params.id}`,
      { method: "GET", cache: "no-store" },
    );
    const parsed = await res.json();
    const post = parsed.post as Post;
    const tags = parsed.tags as Tag[];
    return (
      <>
        <Suspense
          fallback={
            <div className="pt-48">
              <LoadingSpinner height={48} width={48} />
            </div>
          }
        >
          <EditingClient post={post} tags={tags} />
        </Suspense>
      </>
    );
  } else {
    redirect(`${env.NEXT_PUBLIC_DOMAIN}/401`);
  }
}
