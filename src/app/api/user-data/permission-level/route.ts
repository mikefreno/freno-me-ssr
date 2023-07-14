import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { env } from "@/env.mjs";
const token = cookies().get("token");
if (token) {
  jwt.verify(token.value, env.JWT_SECRET_KEY, async (err, value) => {
    if (!err && value == env.ADMIN_EMAIL) {
    }
  });
}
