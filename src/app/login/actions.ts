"use server";

import { env } from "@/env.mjs";
import { User } from "@/types/model-types";
import { checkPassword, hashPassword } from "../api/passwordHashing";
import { cookies } from "next/headers";
import { v4 as uuidV4 } from "uuid";
import jwt from "jsonwebtoken";
import { ConnectionFactory } from "../utils";

export async function emailRegistration(
  email: string,
  password: string,
  passwordConfirmation: string,
) {
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
      try {
        await conn.execute(userCreationQuery, params);
        const followUpQuery = `SELECT * FROM User WHERE email=?`;
        const followUpParams = [email];
        const followUpRes = await conn.execute(followUpQuery, followUpParams);
        const userID = (followUpRes.rows[0] as User).id;
        cookies().set("userIDToken", userID);
        return "success";
      } catch (e) {
        console.log(e);
        return "duplicate";
      }
    }
    return "passwordMismatch";
  }
}

export async function emailPasswordLogin(
  email: string,
  password: string,
  rememberMe: boolean,
) {
  if (email && password) {
    const conn = ConnectionFactory();
    const userQuery = "SELECT * FROM User WHERE email = ?";
    const params = [email];
    try {
      const userResults = await conn.execute(userQuery, params);
      const user = userResults.rows[0] as User;
      if (user) {
        const passwordHash = user.password_hash;
        const passwordMatch = await checkPassword(password, passwordHash!);

        if (passwordMatch) {
          const token = jwt.sign({ id: user.id }, env.JWT_SECRET_KEY, {
            expiresIn: 60 * 60 * 24 * 14, // expires in 14 days
          });
          if (rememberMe) {
            cookies().set({
              name: "userIDToken",
              value: token,
              maxAge: 60 * 60 * 24 * 14, // expires in 14 days
            });
          } else {
            const token = jwt.sign({ id: user.id }, env.JWT_SECRET_KEY, {
              expiresIn: 60 * 60 * 12, // expires in 12 hrs
            });
            cookies().set({
              name: "userIDToken",
              value: token,
            });
          }
          return "success";
        } else {
          console.log("bad password");
          return "no-match";
        }
      }
    } catch (err) {
      console.log("error: " + err);
      console.log("bad email");
      return "no-match";
    }
  } else {
    return "no-match";
  }
}
export async function emailLinkLogin(email: string, rememberMe: boolean) {
  const requestedLoginExp = cookies().get("emailLoginLinkRequested");
  let remaining = 0;
  if (requestedLoginExp) {
    const expires = new Date(requestedLoginExp?.value);
    remaining = expires.getTime() - Date.now();
  }
  if (remaining <= 0) {
    const conn = ConnectionFactory();
    const query = `SELECT * FROM User WHERE email = ?`;
    const params = [email];
    const lookupRes = await conn.execute(query, params);
    if (lookupRes.rows[0]) {
      const apiKey = env.SENDINBLUE_KEY as string;
      const apiUrl = "https://api.sendinblue.com/v3/smtp/email";

      const secretKey = env.JWT_SECRET_KEY;
      const payload = { email: email, rememberMe: rememberMe };
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
        <p>Click the button below to log in</p>
    </div>
    <br/>
    <div class="center">
        <a href=${env.NEXT_PUBLIC_DOMAIN}/api/auth/email-login/${email}/?token=${token} class="button">Log In</a>
    </div>
    <div class="center">
        <p>You can ignore this if you did not request this email, someone may have requested it in error</p>
    </div>
</body>
</html>
`,
        subject: `freno.me login link`,
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
      const exp = new Date(Date.now() + 2 * 60 * 1000);
      cookies().set("emailLoginLinkRequested", exp.toUTCString());
      return "email sent";
    }
  }
}
