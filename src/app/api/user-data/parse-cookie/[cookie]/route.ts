import { NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import { env } from "@/env.mjs";
export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  if (context.params.id !== "undefined") {
    jwt.verify(context.params.id, env.JWT_SECRET_KEY, (err, decoded) => {
      if (err) {
        console.log("Failed to authenticate token.");
        return NextResponse.json({ id: "" });
      } else {
        return NextResponse.json({ id: (decoded as JwtPayload).id });
      }
    });
  } else {
    return NextResponse.json({ id: "" });
  }
}
