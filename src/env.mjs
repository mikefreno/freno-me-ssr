import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    // Add `.min(1) on ID and SECRET if you want to make sure they're not empty
    NODE_ENV: z.enum(["development", "test", "production"]),
    ADMIN_EMAIL: z.string().min(1),
    ADMIN_ID: z.string().min(1),
    JWT_SECRET_KEY: z.string().min(1),
    DANGEROUS_DBCOMMAND_PASSWORD: z.string().min(1),
    AWS_REGION: z.string().min(1),
    AWS_S3_BUCKET_NAME: z.string().min(1),
    _AWS_ACCESS_KEY: z.string().min(1),
    _AWS_SECRET_KEY: z.string().min(1),
    GOOGLE_CLIENT_SECRET: z.string().min(1),
    GITHUB_CLIENT_SECRET: z.string().min(1),
    EMAIL_SERVER: z.string().min(1),
    EMAIL_FROM: z.string().min(1),
    SENDINBLUE_KEY: z.string().min(1),
    TURSO_DB_URL: z.string().min(1),
    TURSO_DB_TOKEN: z.string().min(1),
    TURSO_LINEAGE_URL: z.string().min(1),
    TURSO_LINEAGE_TOKEN: z.string().min(1),
    TURSO_DB_API_TOKEN: z.string().min(1),
    LINEAGE_OFFLINE_SERIALIZATION_SECRET: z.string().min(1)
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    NEXT_PUBLIC_DOMAIN: z.string().min(1),
    NEXT_PUBLIC_AWS_BUCKET_STRING: z.string().min(1),
    NEXT_PUBLIC_GOOGLE_CLIENT_ID: z.string().min(1),
    NEXT_PUBLIC_GOOGLE_CLIENT_ID_MAGIC_DELVE: z.string().min(1),
    NEXT_PUBLIC_GITHUB_CLIENT_ID: z.string().min(1),
    NEXT_PUBLIC_WEBSOCKET: z.string().min(1),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    ADMIN_EMAIL: process.env.ADMIN_EMAIL,
    ADMIN_ID: process.env.ADMIN_ID,
    JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
    DANGEROUS_DBCOMMAND_PASSWORD: process.env.DANGEROUS_DBCOMMAND_PASSWORD,
    AWS_REGION: process.env.AWS_REGION,
    NEXT_PUBLIC_AWS_BUCKET_STRING: process.env.NEXT_PUBLIC_AWS_BUCKET_STRING,
    NEXT_PUBLIC_DOMAIN: process.env.NEXT_PUBLIC_DOMAIN,
    NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    NEXT_PUBLIC_GOOGLE_CLIENT_ID_MAGIC_DELVE: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID_MAGIC_DELVE,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    NEXT_PUBLIC_GITHUB_CLIENT_ID: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
    EMAIL_SERVER: process.env.EMAIL_SERVER,
    EMAIL_FROM: process.env.EMAIL_FROM,
    SENDINBLUE_KEY: process.env.SENDINBLUE_KEY,
    AWS_S3_BUCKET_NAME: process.env.AWS_S3_BUCKET_NAME,
    _AWS_ACCESS_KEY: process.env._AWS_ACCESS_KEY,
    _AWS_SECRET_KEY: process.env._AWS_SECRET_KEY,
    NEXT_PUBLIC_WEBSOCKET: process.env.NEXT_PUBLIC_WEBSOCKET,
    TURSO_DB_URL: process.env.TURSO_DB_URL,
    TURSO_DB_TOKEN: process.env.TURSO_DB_TOKEN,
    TURSO_LINEAGE_URL: process.env.TURSO_LINEAGE_URL,
    TURSO_LINEAGE_TOKEN: process.env.TURSO_LINEAGE_TOKEN,
    TURSO_DB_API_TOKEN: process.env.TURSO_DB_API_TOKEN,
    LINEAGE_OFFLINE_SERIALIZATION_SECRET: process.env.LINEAGE_OFFLINE_SERIALIZATION_SECRET
  },

  skipValidation: false,
});
