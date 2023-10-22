import jwt, { JwtPayload } from "jsonwebtoken";
import { cookies } from "next/headers";

export async function getPrivilegeLevel(): Promise<
  "anonymous" | "admin" | "user"
> {
  try {
    const userIDToken = cookies().get("userIDToken");

    if (userIDToken) {
      const decoded = await new Promise<JwtPayload | undefined>((resolve) => {
        jwt.verify(userIDToken.value, env.JWT_SECRET_KEY, (err, decoded) => {
          if (err) {
            console.log("Failed to authenticate token.");
            cookies().set({
              name: "userIDToken",
              value: "",
              maxAge: 0,
              expires: new Date("2016-10-05"),
            });
            resolve(undefined);
          } else {
            resolve(decoded as JwtPayload);
          }
        });
      });

      if (decoded) {
        return decoded.id === env.ADMIN_ID ? "admin" : "user";
      }
    }
  } catch (e) {
    return "anonymous";
  }
  return "anonymous";
}
export async function getUserID(): Promise<string | null> {
  try {
    const userIDToken = cookies().get("userIDToken");

    if (userIDToken) {
      const decoded = await new Promise<JwtPayload | undefined>((resolve) => {
        jwt.verify(userIDToken.value, env.JWT_SECRET_KEY, (err, decoded) => {
          if (err) {
            console.log("Failed to authenticate token.");
            cookies().set({
              name: "userIDToken",
              value: "",
              maxAge: 0,
              expires: new Date("2016-10-05"),
            });
            resolve(undefined);
          } else {
            resolve(decoded as JwtPayload);
          }
        });
      });

      if (decoded) {
        return decoded.id;
      }
    }
  } catch (e) {
    return null;
  }
  return null;
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
