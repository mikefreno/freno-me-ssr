import { env } from "@/env.mjs";
import { API_RES_GetUserDataFromCookie } from "@/types/response-types";
import { cookies } from "next/headers";
import ClientSideData from "./ClientSideData";

export default async function AccountPage() {
  const userID = cookies().get("userIDToken")?.value;
  const res = await fetch(
    `${env.NEXT_PUBLIC_DOMAIN}/api/user-data/cookie/${userID}`,
    {
      method: "GET",
    }
  );
  const resData = (await res.json()) as API_RES_GetUserDataFromCookie;

  return <ClientSideData userData={resData} />;
}
