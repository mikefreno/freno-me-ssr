import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  return new NextResponse(process.env.LINEAGE_OFFLINE_SERIALIZATION_SECRET);
}
