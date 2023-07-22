import { User } from "@/types/model-types";
import { ConnectionFactory } from "@/app/api/database/ConnectionFactory";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  if (context.params.id !== "undefined") {
    const conn = ConnectionFactory();
    const userQuery = "SELECT * FROM User WHERE id =?";
    const userParams = [context.params.id];
    const res = await conn.execute(userQuery, userParams);
    if (res.rows[0]) {
      const user = res.rows[0] as User;
      if (user && user.display_name !== "user deleted")
        return NextResponse.json(
          {
            id: user.id,
            email: user.email,
            emailVerified: user.email_verified,
            image: user.image,
            displayName: user.display_name,
            provider: user.provider,
            hasPassword: user.password_hash ? true : false,
          },
          { status: 202 }
        );
    }
  }
  return NextResponse.json({ status: 204 });
}