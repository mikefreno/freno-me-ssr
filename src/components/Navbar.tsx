import { env } from "@/env.mjs";
import { API_RES_GetUserDataFromCookie } from "@/types/response-types";
import { cookies } from "next/headers";
import NavbarClient from "./NavbarClient";

export default async function Navbar() {
  let userData: {
    id: string;
    email: string | undefined;
    emailVerified: boolean;
    image: string | null;
    displayName: string | undefined;
    provider: string | undefined;
    hasPassword: boolean;
  } | null = null;
  let status = 0;
  try {
    const userIDCookie = cookies().get("userIDToken");
    const res = await fetch(
      `${env.NEXT_PUBLIC_DOMAIN}/api/user-data/cookie/${
        userIDCookie ? userIDCookie.value : "undefined"
      }`,
      { method: "GET", cache: "no-store" }
    );
    status = res.status;
    userData = (await res.json()) as API_RES_GetUserDataFromCookie;
  } catch (e) {
    console.log(e);
  }
  return <NavbarClient user={userData} status={status} />;
}
