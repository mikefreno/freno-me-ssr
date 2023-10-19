import { env } from "@/env.mjs";
import NavbarClient from "./NavbarClient";
import { getUserID } from "@/app/utils";

export default async function Navbar() {
  let userData: {
    email?: string;
    image?: string;
    displayName?: string;
  } | null = null;
  let status = 0;
  try {
    const userID = await getUserID();
    const res = await fetch(
      `${env.NEXT_PUBLIC_DOMAIN}/api/database/user/public-data/${userID}`,
      {
        method: "GET",
      },
    );
    userData = await res.json();

    status = res.status;
  } catch (e) {
    console.log(e);
  }
  return <NavbarClient user={userData} status={status} />;
}
