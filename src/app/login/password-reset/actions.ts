"use server";
import { ConnectionFactory } from "@/app/api/database/ConnectionFactory";
import { hashPassword } from "@/app/api/passwordHashing";
import { env } from "@/env.mjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";

export async function passwordReset(
  newPassword: string,
  newPasswordConfirmation: string,
  token: string
) {
  if (newPassword == newPasswordConfirmation) {
    try {
      const decoded = jwt.verify(token, env.JWT_SECRET_KEY) as JwtPayload;
      if (decoded.id) {
        const conn = ConnectionFactory();
        const passwordHash = await hashPassword(newPassword);
        const updateQuery = `UPDATE User SET password_hash = ? WHERE id = ?`;
        const updateParams = [passwordHash, decoded.id];
        const res = await conn.execute(updateQuery, updateParams);
        console.log(res);
        cookies().set({
          name: "emailToken",
          value: "",
          maxAge: 0,
        });
        cookies().set({
          name: "userIDToken",
          value: "",
          maxAge: 0,
        });
        return "success";
      } else {
        return "bad token";
      }
    } catch (e) {
      console.log(e);
      return "token expired";
    }
  } else {
    return "Password Mismatch";
  }
}
