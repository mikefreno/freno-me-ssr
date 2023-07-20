import { NextRequest, NextResponse } from "next/server";
import { ConnectionFactory } from "../../database/ConnectionFactory";
import { cookies } from "next/headers";
import { newEmailInput } from "@/types/input-types";

export async function POST(input: NextRequest) {
  const inputData = (await input.json()) as newEmailInput;
  const { id, newEmail } = inputData;
  const oldEmail = cookies().get("emailToken");
  const conn = ConnectionFactory();
  const query = `UPDATE User SET email = ? WHERE id = ? AND email = ?`;
  const params = [newEmail, id, oldEmail];
  try {
    const res = await conn.execute(query, params);
    return NextResponse.json({ res: res }, { status: 202 });
  } catch (e) {
    console.log(e);
    return NextResponse.json({ status: 400 });
  }
}
