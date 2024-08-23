import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { env } from "@/env.mjs";

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return new NextResponse(JSON.stringify({ valid: false }), { status: 401 });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET_KEY) as jwt.JwtPayload;

    // Generate a new token
    const newToken = jwt.sign(
      { userId: decoded.userId, email: decoded.email },
      env.JWT_SECRET_KEY,
      { expiresIn: "7d" },
    );

    return new NextResponse(
      JSON.stringify({
        valid: true,
        token: newToken,
      }),
      { status: 200 },
    );
  } catch (error) {
    return new NextResponse(JSON.stringify({ valid: false }), { status: 401 });
  }
}
