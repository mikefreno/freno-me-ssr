import { NextRequest, NextResponse } from "next/server";
import { ConnectionFactory } from "../../ConnectionFactory";
import { cookies } from "next/headers";

interface POSTInputData {
  title: string;
  subtitle: string | null;
  body: string | null;
  banner_photo: string | null;
  published: boolean;
}

interface PATCHInputData {
  id: number;
  title: string | null;
  subtitle: string | null;
  body: string | null;
  banner_photo: string | null;
  published: boolean | null;
}

export async function POST(input: NextRequest) {
  try {
    const inputData = (await input.json()) as POSTInputData;
    const { title, subtitle, body, banner_photo, published } = inputData;
    const userIDCookie = cookies().get("userIDToken");
    if (userIDCookie) {
      const author_id = userIDCookie.value;
      const conn = ConnectionFactory();
      const query = `
    INSERT INTO Project (title, subtitle, body, banner_photo, published, author_id)
    VALUES (?, ?, ?, ?, ?, ?)
    `;
      const params = [
        title,
        subtitle,
        body,
        banner_photo,
        published,
        author_id,
      ];
      const results = await conn.execute(query, params);
      return NextResponse.json({ data: results.insertId }, { status: 201 });
    }
  } catch (e) {
    return NextResponse.json({ error: e }, { status: 400 });
  }
}
