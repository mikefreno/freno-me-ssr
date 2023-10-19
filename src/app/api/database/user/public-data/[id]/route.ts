import { User } from "@/types/model-types";
import { ConnectionFactory } from "@/app/utils";
import { NextResponse } from "next/server";
export async function GET(_: Request, context: { params: { id: string } }) {
  try {
    const conn = ConnectionFactory();
    const userQuery = "SELECT email, display_name, image FROM User WHERE id =?";
    const userParams = [context.params.id];
    const res = await conn.execute(userQuery, userParams);
    if (res.rows[0]) {
      const user = res.rows[0] as User;
      if (user && user.display_name !== "user deleted")
        return NextResponse.json(
          {
            email: user.email,
            image: user.image,
            displayName: user.display_name,
          },
          { status: 202 },
        );
    }
    return NextResponse.json({}, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({}, { status: 200 });
  }
}
