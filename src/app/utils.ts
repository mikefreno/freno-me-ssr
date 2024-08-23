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

import { createClient } from "@libsql/client/web";
import { env } from "@/env.mjs";

// Turso
export function ConnectionFactory() {
  const config = {
    url: env.TURSO_DB_URL,
    authToken: env.TURSO_DB_TOKEN,
  };

  const conn = createClient(config);
  return conn;
}

export function MagicDelveConnectionFactory() {
  const config = {
    url: env.TURSO_MAGIC_DELVE_URL,
    authToken: env.TURSO_MAGIC_DELVE_TOKEN,
  };

  const conn = createClient(config);
  return conn;
}

import { v4 as uuid } from "uuid";
import { createClient as createAPIClient } from "@tursodatabase/api";

export async function MagicDelveDBInit() {
  const turso = createAPIClient({
    org: "mikefreno",
    token: env.TURSO_DB_API_TOKEN,
  });

  const db_name = uuid();
  const db = await turso.databases.create(db_name, { group: "default" });

  const token = await turso.databases.createToken(db_name, {
    authorization: "full-access",
  });

  return { token: token.jwt, dbName: db.name };
}
