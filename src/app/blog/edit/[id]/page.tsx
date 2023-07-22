import EditingClient from "@/components/EditingClient";
import { env } from "@/env.mjs";
import { Blog } from "@/types/model-types";

export default async function ProjectEditing({
  params,
}: {
  params: { id: string };
}) {
  const res = await fetch(
    `${env.NEXT_PUBLIC_DOMAIN}/api/database/blog/by-id/${params.id}`,
    { method: "GET", cache: "no-store" }
  );
  const post = (await res.json()).blog as Blog;
  return (
    <>
      <EditingClient post={post} type={"blog"} />
    </>
  );
}
