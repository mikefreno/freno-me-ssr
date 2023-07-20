"use server";

import { env } from "@/env.mjs";
import { ConnectionFactory } from "@/app/api/database/ConnectionFactory";
import { User } from "@/types/model-types";
import { checkPassword, hashPassword } from "../api/passwordHashing";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { v4 as uuidV4 } from "uuid";

export async function emailRegistration(input: FormData) {
  const email = input.get("email")?.toString();
  const password = input.get("password")?.toString();
  const passwordConfirmation = input.get("passwordConfirmation")?.toString();
  if (email && password && passwordConfirmation) {
    if (password == passwordConfirmation) {
      const passwordHash = await hashPassword(password);
      const conn = ConnectionFactory();
      const userId = uuidV4();
      const userCreationQuery = `
    INSERT INTO User (id, email, password_hash)
    VALUES (?, ?, ?)
  `;
      const params = [userId, email, passwordHash];
      const res = await conn.execute(userCreationQuery, params);
      const userID = (res.rows[0] as User).id;
      cookies().set("userIDToken", userID);
      redirect("/account");
    }
  }
}

export async function emailPasswordLogin(data: FormData) {
  const email = data.get("email")?.toString();
  const password = data.get("password")?.toString();
  const rememberMeValue = data.get("rememberMe");

  console.log("Email: " + email);
  if (email && password) {
    const conn = ConnectionFactory();
    const userQuery = "SELECT * FROM User WHERE email = ?";
    const params = [email];
    const userResults = await conn.execute(userQuery, params);
    const user = userResults.rows[0] as User;
    if (user) {
      const passwordHash = user.password_hash;
      const passwordMatch = await checkPassword(password, passwordHash!);

      if (passwordMatch && rememberMeValue == "on") {
        cookies().set({
          name: "emailToken",
          value: email,
          maxAge: 60 * 60 * 24 * 14,
        });
        cookies().set({
          name: "userIDToken",
          value: user.id,
          maxAge: 60 * 60 * 24 * 14,
        });
      } else if (passwordMatch) {
        cookies().set({
          name: "emailToken",
          value: email,
        });
        cookies().set({
          name: "userIDToken",
          value: user.id,
        });
      }
      redirect("/account");
    }
  } else {
    redirect("/login?error=bad-password");
  }
}
export async function emailLinkLogin(input: FormData) {}
