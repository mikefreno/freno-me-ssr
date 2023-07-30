import { User } from "@/types/model-types";
import { ConnectionFactory } from "@/app/api/database/ConnectionFactory";
import { NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import { env } from "@/env.mjs";
import { cookies } from "next/headers";
import { signOut } from "@/app/globalActions";

export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  if (context.params.id !== "undefined") {
    try {
      const decoded = await new Promise<JwtPayload | undefined>(
        (resolve, reject) => {
          jwt.verify(
            context.params.id,
            env.JWT_SECRET_KEY,
            async (err, decoded) => {
              if (err) {
                console.log("Failed to authenticate token.");
                await signOut();
                reject(err);
              } else {
                resolve(decoded as JwtPayload);
              }
            }
          );
        }
      );

      if (decoded) {
        const conn = ConnectionFactory();
        const userQuery = "SELECT * FROM User WHERE id =?";
        const userParams = [decoded.id];
        const res = await conn.execute(userQuery, userParams);
        if (res.rows[0]) {
          const user = res.rows[0] as User;
          if (user && user.display_name !== "user deleted") {
            return NextResponse.json(
              {
                id: user.id,
                email: user.email,
                emailVerified: user.email_verified,
                image: user.image,
                displayName: user.display_name,
                provider: user.provider,
                hasPassword: !!user.password_hash,
              },
              { status: 202 }
            );
          }
        }
      }
    } catch (err) {
      console.error(err);
    }
  }
  return NextResponse.json({}, { status: 200 });
}
