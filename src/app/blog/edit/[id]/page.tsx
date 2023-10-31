import { getPrivilegeLevel } from "@/app/utils";
import EditingClient from "@/components/EditingClient";
import LoadingSpinner from "@/components/LoadingSpinner";
import { env } from "@/env.mjs";
import { Post, PostWithTags } from "@/types/model-types";
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
    const post = (await res.json()).post as PostWithTags;
    return (
      <>
        <Suspense
          fallback={
            <div className="pt-48">
              <LoadingSpinner height={48} width={48} />
            </div>
          }
        >
          <EditingClient post={post} />
        </Suspense>
      </>
    );
  } else {
    redirect(`${env.NEXT_PUBLIC_DOMAIN}/401`);
  }
}
