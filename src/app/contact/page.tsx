import { env } from "@/env.mjs";
import { API_RES_GetUserDataFromCookie } from "@/types/response-types";
import { cookies } from "next/headers";
import ContactClient from "./ContactClient";
import { getUserID } from "../utils";

export default async function ContactPage() {
  let status = 0;
  const userID = await getUserID();
  if (userID) {
    const res = await fetch(
      `${env.NEXT_PUBLIC_DOMAIN}/api/user-data/cookie/${userID}`,
      {
        method: "GET",
      },
    );
    const resData = (await res.json()) as API_RES_GetUserDataFromCookie;
    status = res.status;
    return <ContactClient user={resData} status={status} />;
  }
  return <ContactClient user={null} status={status} />;
}
