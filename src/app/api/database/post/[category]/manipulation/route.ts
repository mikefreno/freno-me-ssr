import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { env } from "@/env.mjs";
import { ConnectionFactory } from "@/app/utils";

interface POSTInputData {
  title: string;
  subtitle: string | null;
  body: string | null;
  banner_photo: string | null;
  published: boolean;
  tags: string[] | null;
}

interface PATCHInputData {
  id: number;
  title: string | null;
  subtitle: string | null;
  body: string | null;
  banner_photo: string | null;
  published: boolean | null;
  tags: string[] | null;
}

export async function POST(
  input: NextRequest,
  context: { params: { category: string } },
) {
  if (
    context.params.category !== "blog" &&
    context.params.category !== "project"
  ) {
    return NextResponse.json(
      { error: "invalid category value" },
      { status: 400 },
    );
  } else {
    try {
      const inputData = (await input.json()) as POSTInputData;
      const { title, subtitle, body, banner_photo, published, tags } =
        inputData;
      const userIDCookie = cookies().get("userIDToken");
      const fullURL = env.NEXT_PUBLIC_AWS_BUCKET_STRING + banner_photo;

      if (userIDCookie) {
        const author_id = userIDCookie.value;
        const conn = ConnectionFactory();
        const query = `
          INSERT INTO Post (title, category, subtitle, body, banner_photo, published, author_id)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        const params = [
          title,
          context.params.category,
          subtitle,
          body,
          banner_photo ? fullURL : null,
          published,
          author_id,
        ];
        const results = await conn.execute(query, params);
        if (tags) {
          let query = "INSERT INTO Tag (value, post_id) VALUES ";
          let values = tags.map((tag) => `("${tag}", ${results.insertId})`);
          query += values.join(", ");
          await conn.execute(query);
        }
        return NextResponse.json({ data: results.insertId }, { status: 201 });
      }
      return NextResponse.json({ error: "no cookie" }, { status: 401 });
    } catch (e) {
      console.error(e);
      return NextResponse.json({ error: e }, { status: 400 });
    }
  }
}
export async function PATCH(input: NextRequest) {
  try {
    const inputData = (await input.json()) as PATCHInputData;

    const conn = ConnectionFactory();
    const { query, params } = createUpdateQuery(inputData);
    const results = await conn.execute(query, params);
    const { tags, id } = inputData;
    const deleteTagsQuery = `DELETE FROM Tag WHERE post_id = ?`;
    await conn.execute(deleteTagsQuery, [id]);
    if (tags) {
      let query = "INSERT INTO Tag (value, post_id) VALUES ";
      let values = tags.map((tag) => `("${tag}", ${id})`);
      query += values.join(", ");
      await conn.execute(query);
    }
    return NextResponse.json({ data: results.insertId }, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: e }, { status: 400 });
  }
}

function createUpdateQuery(data: PATCHInputData) {
  const { id, title, subtitle, body, banner_photo, published } = data;

  let query = "UPDATE Post SET ";
  let params = [];
  let first = true;

  if (title !== null) {
    query += first ? "title = ?" : ", title = ?";
    params.push(title);
    first = false;
  }

  if (subtitle !== null) {
    query += first ? "subtitle = ?" : ", subtitle = ?";
    params.push(subtitle);
    first = false;
  }

  if (body !== null) {
    query += first ? "body = ?" : ", body = ?";
    params.push(body);
    first = false;
  }

  if (banner_photo !== null) {
    query += first ? "banner_photo = ?" : ", banner_photo = ?";
    if (banner_photo == "_DELETE_IMAGE_") {
      params.push(undefined);
    } else {
      params.push(env.NEXT_PUBLIC_AWS_BUCKET_STRING + banner_photo);
    }
    first = false;
  }

  if (published !== null) {
    query += first ? "published = ?" : ", published = ?";
    params.push(published);
    first = false;
  }

  query += first ? "author_id = ?" : ", author_id = ?";
  params.push(cookies().get("userIDToken")?.value);

  query += " WHERE id = ?";
  params.push(id);

  return { query, params };
}
