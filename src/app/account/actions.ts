"use server";

import { env } from "@/env.mjs";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { User } from "@/types/model-types";
import { checkPassword, hashPassword } from "../api/passwordHashing";
import { signOut } from "../globalActions";
import { ConnectionFactory } from "../utils";

export async function sendEmailVerification() {
  const requestedEmail = cookies().get("emailVerificationRequested")?.value;

  let difference: number = 0;
  if (requestedEmail) {
    const time = parseInt(requestedEmail);

    const currentTime = Date.now();

    difference = (currentTime - time) / (1000 * 60);
  }

  if (!requestedEmail || difference >= 15) {
    const userEmail = cookies().get("emailToken")?.value;

    const apiKey = env.SENDINBLUE_KEY as string;
    const apiUrl = "https://api.sendinblue.com/v3/smtp/email";

    const secretKey = env.JWT_SECRET_KEY;
    const payload = { email: userEmail };
    const token = jwt.sign(payload, secretKey, { expiresIn: "15m" });

    const sendinblueData = {
      sender: {
        name: "MikeFreno",
        email: "no_reply@freno.me",
      },
      to: [
        {
          email: userEmail,
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
        <p>Click the button below to verify email</p>
    </div>
    <br/>
    <div class="center">
        <a href=${env.NEXT_PUBLIC_DOMAIN}/api/auth/email-verification/${userEmail}/?token=${token} class="button">Verify Email</a>
    </div>
</body>
</html>
`,
      subject: `freno.me email verification`,
    };
    const res = await fetch(apiUrl, {
      method: "POST",
      headers: {
        accept: "application/json",
        "api-key": apiKey,
        "content-type": "application/json",
      },
      body: JSON.stringify(sendinblueData),
    });
    cookies().set("emailVerificationRequested", Date.now().toString());
  }
}

export async function setEmail(newEmail: string) {
  const userID = cookies().get("userIDToken")?.value;
  const conn = ConnectionFactory();
  const query = `UPDATE User SET email = ?, email_verified = ? WHERE id = ?`;
  const params = [newEmail, false, userID];
  const res = await conn.execute({ sql: query, args: params as string[] });
  console.log(res);
  const followUpQuery = `SELECT * FROM User WHERE id=?`;
  const followUpParams = [userID];
  const followUpRes = await conn.execute({
    sql: followUpQuery,
    args: followUpParams as string[],
  });

  const user = followUpRes.rows[0] as unknown as User;
  const data = {
    id: user.id,
    email: user.email,
    emailVerified: user.email_verified ? true : false,
    image: user.image,
    displayName: user.display_name,
    provider: user.provider,
    hasPassword: user.password_hash ? true : false,
  };
  cookies().set({
    name: "emailToken",
    value: newEmail,
  });
  return data;
}

export async function setDisplayName(displayName: string) {
  const userID = cookies().get("userIDToken")?.value;
  const conn = ConnectionFactory();
  const query = `UPDATE User SET display_name = ? WHERE id = ?`;
  const params = [displayName, userID];
  const res = await conn.execute({ sql: query, args: params as string[] });
  console.log(res);
  const followUpQuery = `SELECT * FROM User WHERE id=?`;
  const followUpParams = [userID];
  const followUpRes = await conn.execute({
    sql: followUpQuery,
    args: followUpParams as string[],
  });
  const user = followUpRes.rows[0] as unknown as User;
  const data = {
    id: user.id,
    email: user.email,
    emailVerified: user.email_verified,
    image: user.image,
    displayName: user.display_name,
    provider: user.provider,
    hasPassword: user.password_hash ? true : false,
  };
  return data;
}

export async function deleteAccount(password: string) {
  const userID = cookies().get("userIDToken")?.value;
  const conn = ConnectionFactory();
  const query = `SELECT * FROM User WHERE id = ?`;
  const params = [userID];
  const res = await conn.execute({ sql: query, args: params as string[] });
  const user = res.rows[0] as unknown as User;
  if (user) {
    const passwordHash = user.password_hash;
    const passwordMatch = await checkPassword(password, passwordHash!);
    if (passwordMatch) {
      const bleachQuery = `UPDATE User SET email = ?, email_verified = ?, password_hash = ?, display_name = ?, provider = ?, image = ? WHERE id = ?`;
      const bleachParams = [
        null,
        false,
        null,
        "user deleted",
        null,
        null,
        userID,
      ];
      const res = await conn.execute({
        sql: bleachQuery,
        args: bleachParams as string[],
      });
      console.log(res);
      await signOut();
      return "deleted";
    } else {
      return "Password Did Not Match";
    }
  }
}
export async function changePassword(
  newPassword: string,
  newPasswordConfirmation: string,
  oldPassword: string,
) {
  if (newPassword == newPasswordConfirmation) {
    const userID = cookies().get("userIDToken")?.value;
    const conn = ConnectionFactory();
    const query = `SELECT * FROM User WHERE id = ?`;
    const params = [userID];
    const res = await conn.execute({ sql: query, args: params as string[] });
    const user = res.rows[0] as unknown as User;
    if (user) {
      const passwordHash = user.password_hash;
      const passwordMatch = await checkPassword(oldPassword, passwordHash!);
      if (passwordMatch) {
        const passwordHash = await hashPassword(newPassword);
        const updateQuery = `UPDATE User SET password_hash = ? WHERE id = ?`;
        const updateParams = [passwordHash, userID];
        await conn.execute({
          sql: updateQuery,
          args: updateParams as string[],
        });
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
        return "Password did not match record";
      }
    }
  } else {
    return "Password Mismatch";
  }
}
export async function setPassword(
  newPassword: string,
  newPasswordConfirmation: string,
) {
  if (newPassword == newPasswordConfirmation) {
    const userID = cookies().get("userIDToken")?.value;
    const conn = ConnectionFactory();
    const query = `SELECT * FROM User WHERE id = ?`;
    const params = [userID];
    const res = await conn.execute({ sql: query, args: params as string[] });
    const user = res.rows[0] as unknown as User;
    if (user && !user.password_hash) {
      const passwordHash = await hashPassword(newPassword);
      const updateQuery = `UPDATE User SET password_hash = ? WHERE id = ?`;
      const updateParams = [passwordHash, userID];
      await conn.execute({ sql: updateQuery, args: updateParams as string[] });
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
      return "Password exists";
    }
  }
}
