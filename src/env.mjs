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
    DATABASE_URL: z.string().min(1),
    DANGEROUS_DBCOMMAND_PASSWORD: z.string().min(1),
    AWS_REGION: z.string().min(1),
    GOOGLE_CLIENT_SECRET: z.string().min(1),
    GITHUB_CLIENT_SECRET: z.string().min(1),
    EMAIL_SERVER: z.string().min(1),
    EMAIL_FROM: z.string().min(1),
    SENDINBLUE_KEY: z.string().min(1),
    AWS_S3_BUCKET_NAME: z.string().min(1),
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
    NEXT_PUBLIC_GITHUB_CLIENT_ID: z.string().min(1),
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
    DATABASE_URL: process.env.DATABASE_URL,
    DANGEROUS_DBCOMMAND_PASSWORD: process.env.DANGEROUS_DBCOMMAND_PASSWORD,
    AWS_REGION: process.env.AWS_REGION,
    NEXT_PUBLIC_AWS_BUCKET_STRING: process.env.NEXT_PUBLIC_AWS_BUCKET_STRING,
    NEXT_PUBLIC_DOMAIN: process.env.NEXT_PUBLIC_DOMAIN,
    NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    NEXT_PUBLIC_GITHUB_CLIENT_ID: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
    EMAIL_SERVER: process.env.EMAIL_SERVER,
    EMAIL_FROM: process.env.EMAIL_FROM,
    SENDINBLUE_KEY: process.env.SENDINBLUE_KEY,
    AWS_S3_BUCKET_NAME: process.env.AWS_S3_BUCKET_NAME,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
   * This is especially useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
