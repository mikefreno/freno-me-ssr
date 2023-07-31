import { NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import { env } from "@/env.mjs";
export async function GET(
  request: Request,
  context: { params: { cookie: string } }
) {
  if (context.params.cookie !== "undefined") {
    try {
      const decoded = await new Promise<JwtPayload | undefined>(
        (resolve, reject) => {
          jwt.verify(
            context.params.cookie,
            env.JWT_SECRET_KEY,
            (err, decoded) => {
              if (err) {
                console.log("Failed to authenticate token.");
                reject(err);
              } else {
                resolve(decoded as JwtPayload);
              }
            }
          );
        }
      );
      if (decoded) {
        return NextResponse.json({ id: (decoded as JwtPayload).id });
      }
      return NextResponse.json({ id: "" });
    } catch (e) {
      console.log(e);
      return NextResponse.json({ id: "" });
    }
  } else {
    return NextResponse.json({ id: "" });
  }
}
