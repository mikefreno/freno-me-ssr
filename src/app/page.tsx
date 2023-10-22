import { env } from "@/env.mjs";
import HomeClient from "./HomeClient";
import { getUserID } from "./utils";

export default async function Home() {
  const userID = await getUserID();
  let user = null;
  if (userID) {
    const res = await fetch(
      `${env.NEXT_PUBLIC_DOMAIN}/api/database/user/public-data/${userID}`,
      {
        method: "GET",
      },
    );

    user = (await res.json()) as {
      email?: string | undefined;
      display_name?: string | undefined;
      image?: string | undefined;
    } | null;
  }
  return (
    <>
      <HomeClient user={user} />
    </>
  );
}
