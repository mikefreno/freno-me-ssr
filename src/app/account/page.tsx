import { env } from "@/env.mjs";
import { API_RES_GetUserDataFromCookie } from "@/types/response-types";
import ClientSideData from "./ClientSideData";
import { getUserID } from "../utils";

export default async function AccountPage() {
  const userID = await getUserID();
  if (userID) {
    const res = await fetch(
      `${env.NEXT_PUBLIC_DOMAIN}/api/user-data/cookie/${userID}`,
      {
        method: "GET",
      },
    );
    const resData = (await res.json()) as API_RES_GetUserDataFromCookie;

    return <ClientSideData userData={resData} />;
  }
}
