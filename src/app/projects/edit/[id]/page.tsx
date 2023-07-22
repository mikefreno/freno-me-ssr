import EditingClient from "@/components/EditingClient";
import { env } from "@/env.mjs";
import { Project } from "@/types/model-types";

export default async function ProjectEditing({
  params,
}: {
  params: { id: string };
}) {
  const res = await fetch(
    `${env.NEXT_PUBLIC_DOMAIN}/api/database/project/by-id/${params.id}`,
    { method: "GET", cache: "no-store" }
  );
  const post = (await res.json()).project as Project;
  return (
    <>
      <EditingClient post={post} type={"projects"} />
    </>
  );
}
