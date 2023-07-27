import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextRequest, NextResponse } from "next/server";
import { env } from "@/env.mjs";

interface InputData {
  type: string;
  title: string;
  filename: string;
}

export async function POST(input: NextRequest) {
  const inputData = (await input.json()) as InputData;
  const { type, title, filename } = inputData;

  const client = new S3Client({
    region: env.AWS_REGION,
  });
  const Key = `${type}/${title}/${filename}`;
  const ext = /^.+\.([^.]+)$/.exec(filename);

  const s3params = {
    Bucket: env.AWS_S3_BUCKET_NAME,
    Key,
    ContentType: `image/${ext![1]}`,
  };

  const command = new PutObjectCommand(s3params);

  const signedUrl = await getSignedUrl(client, command, { expiresIn: 120 });
  return NextResponse.json({ uploadURL: signedUrl, key: Key });
}
