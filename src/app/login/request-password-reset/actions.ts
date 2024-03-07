"use server";

import { env } from "@/env.mjs";
import { User } from "@/types/model-types";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { ConnectionFactory } from "@/app/utils";

export async function requestPasswordReset(email: string) {
  const requestedPasswordReset = cookies().get("passwordResetRequested");
  let remaining = 0;
  if (requestedPasswordReset) {
    const expires = new Date(requestedPasswordReset?.value);
    remaining = expires.getTime() - Date.now();
  }
  if (remaining <= 0) {
    const conn = ConnectionFactory();
    const query = `SELECT * FROM User WHERE email = ?`;
    const params = [email];
    const lookupRes = await conn.execute({ sql: query, args: params });
    if (lookupRes.rows[0]) {
      const apiKey = env.SENDINBLUE_KEY as string;
      const apiUrl = "https://api.sendinblue.com/v3/smtp/email";

      const secretKey = env.JWT_SECRET_KEY;
      const payload = { id: (lookupRes.rows[0] as User).id };
      const token = jwt.sign(payload, secretKey, { expiresIn: "15m" });

      const sendinblueData = {
        sender: {
          name: "no_reply@freno.me",
          email: "no_reply@freno.me",
        },
        to: [
          {
            email: (lookupRes.rows[0] as User).email,
          },
        ],
        htmlContent: `<html>
<head>
    <style>
        .center {
            display: flex;
            justify-content: center;
            align-items: center;
            text-align: center;
        }
        .button {
            display: inline-block;
            padding: 10px 20px;
            text-align: center;
            text-decoration: none;
            color: #ffffff;
            background-color: #007BFF;
            border-radius: 6px;
            transition: background-color 0.3s;
        }
        .button:hover {
            background-color: #0056b3;
        }
    </style>
</head>
<body>
    <div class="center">
        <p>Click the button below to reset password</p>
    </div>
    <br/>
    <div class="center">
        <a href=${env.NEXT_PUBLIC_DOMAIN}/login/password-reset?token=${token} class="button">Reset Password</a>
    </div>
    <div class="center">
        <p>You can ignore this if you did not request this email, someone may have requested it in error</p>
    </div>
</body>
</html>
`,
        subject: `password reset`,
      };
      await fetch(apiUrl, {
        method: "POST",
        headers: {
          accept: "application/json",
          "api-key": apiKey,
          "content-type": "application/json",
        },
        body: JSON.stringify(sendinblueData),
      });
      const exp = new Date(Date.now() + 5 * 60 * 1000);
      cookies().set("passwordResetRequested", exp.toUTCString());
      return "email sent";
    }
  }
}
