import {
  dumpAndSendDB,
  LineageConnectionFactory,
  validateLineageRequest,
} from "@/app/utils";
import { env } from "@/env.mjs";
import { NextRequest, NextResponse } from "next/server";
import { createClient as createAPIClient } from "@tursodatabase/api";

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ status: 401, ok: false });
  }

  const auth_token = authHeader.split(" ")[1];
  const { email, db_name, db_token, skip_cron, send_dump_target } =
    await req.json();
  if (!email || !db_name || !db_token || !auth_token) {
    return NextResponse.json({
      status: 401,
      message: "Missing required fields",
    });
  }

  const conn = LineageConnectionFactory();
  const res = await conn.execute({
    sql: `SELECT * FROM User WHERE email = ?`,
    args: [email],
  });
  const userRow = res.rows[0];
  if (!userRow) {
    return NextResponse.json({ status: 404, ok: false });
  }

  const valid = await validateLineageRequest({ auth_token, email, userRow });
  if (!valid) {
    return NextResponse.json({
      ok: false,
      status: 401,
      message: "Invalid Verification",
    });
  }

  const { database_token, database_name } = userRow;

  if (database_token !== db_token || database_name !== db_name) {
    return NextResponse.json({
      ok: false,
      status: 401,
      message: "Incorrect Verification",
    });
  }

  if (skip_cron) {
    const turso = createAPIClient({
      org: "mikefreno",
      token: env.TURSO_DB_API_TOKEN,
    });
    if (send_dump_target) {
      const res = await dumpAndSendDB({
        dbName: db_name,
        sendTarget: send_dump_target,
      });
      if (res.success) {
        const res = await turso.databases.delete(db_name);
        if (res.database) {
          return NextResponse.json({
            ok: true,
            status: 200,
            message: `Database deleted and db dump sent to email: ${send_dump_target}`,
          });
        } else {
          // Shouldn't fail. No idea what the response from turso would be at this point - not documented
          return NextResponse.json({ status: 500, message: "Unknown" });
        }
      } else {
        return NextResponse.json({
          ok: false,
          status: 500,
          message: res.reason,
        });
      }
    } else {
      const res = await turso.databases.delete(db_name);
      if (res.database) {
        return NextResponse.json({
          ok: true,
          status: 200,
          message: `Database deleted`,
        });
      } else {
        // Shouldn't fail. No idea what the response from turso would be at this point - not documented
        return NextResponse.json({
          ok: false,
          status: 500,
          message: "Unknown",
        });
      }
    }
  } else {
    const insertRes = await conn.execute({
      sql: `INSERT INTO cron`,
      args: [email, db_name, db_token, send_dump_target],
    });
    if (insertRes.rowsAffected > 0) {
      return NextResponse.json({
        ok: true,
        status: 200,
        message: `Deletion scheduled.`,
      });
    } else {
      return NextResponse.json({
        ok: false,
        status: 500,
        message: `Deletion not scheduled, due to server failure`,
      });
    }
  }
}
