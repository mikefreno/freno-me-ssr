import { env } from "@/env.mjs";
import ContactClient from "./ContactClient";
import { getUserID } from "../utils";

export default async function ContactPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const viewer = (await searchParams).viewer ?? "default";
  console.log(viewer);
  let status = 0;
  const userID = await getUserID();
  if (userID) {
    const res = await fetch(
      `${env.NEXT_PUBLIC_DOMAIN}/api/database/user/from-id/${userID}`,
      {
        method: "GET",
      },
    );
    const resData = await res.json();
    status = res.status;
    return <ContactClient user={resData} status={status} viewer={viewer} />;
  }
  return <ContactClient user={null} status={status} viewer={viewer} />;
}
