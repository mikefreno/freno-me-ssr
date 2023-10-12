import { User } from "@/types/model-types";
import { ConnectionFactory } from "@/app/utils";
import { NextResponse } from "next/server";

import { signOut } from "@/app/globalActions";

export async function GET(
  request: Request,
  context: { params: { id: string } },
) {
  const userQuery = "SELECT * FROM User WHERE id =?";
  const userParams = [context.params.id];
  const conn = ConnectionFactory();
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
        { status: 202 },
      );
    }
  } else {
    await signOut();
    return NextResponse.json({}, { status: 200 });
  }
  await signOut();
  return NextResponse.json({}, { status: 200 });
}
