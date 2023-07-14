import { connect } from "@planetscale/database";
import { env } from "@/env.mjs";

export function ConnectionFactory() {
  const config = {
    url: env.DATABASE_URL,
  };

  const conn = connect(config);
  return conn;
}
