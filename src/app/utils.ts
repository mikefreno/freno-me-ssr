import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { cookies } from "next/headers";

export async function getUserIDCookieData(): Promise<
  RequestCookie | undefined
> {
  const userIDCookie = cookies().get("userIDToken");
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve(userIDCookie);
    }, 1000),
  );
}
import { connect } from "@planetscale/database";
import { env } from "@/env.mjs";

export function ConnectionFactory() {
  const config = {
    host: env.DATABASE_HOST,
    username: env.DATABASE_USERNAME,
    password: env.DATABASE_PASSWORD,
  };
  const conn = connect(config);
  return conn;
}
