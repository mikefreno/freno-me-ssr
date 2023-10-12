import { connect } from "@planetscale/database";
import { env } from "@/env.mjs";

export function ConnectionFactory() {
  const config = {
    host: env.DATABASE_HOST,
    username: env.DATABASE_USERNAME,
    password: env.DATABASE_PASSWORD,
  };
  const conn = connect(config);
  return conn;
}
