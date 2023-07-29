"use server";

import { env } from "@/env.mjs";
import { cookies } from "next/headers";
import { ConnectionFactory } from "./api/database/ConnectionFactory";
import { Comment } from "@/types/model-types";

export async function signOut() {
  try {
    cookies().set({
      name: "emailToken",
      value: "",
      maxAge: 0,
      expires: new Date("2016-10-05"),
    });
    cookies().set({
      name: "userIDToken",
      value: "",
      maxAge: 0,
      expires: new Date("2016-10-05"),
    });
  } catch (e) {
    console.log("error in action: " + e);
  }
}

interface ContactRequest {
  name: string;
  email: string;
  message: string;
}
export async function sendContactRequest({
  name,
  email,
  message,
}: ContactRequest) {
  const contactExp = cookies().get("contactRequestSent");
  let remaining = 0;
  if (contactExp) {
    const expires = new Date(contactExp?.value);
    remaining = expires.getTime() - Date.now();
  }
  if (remaining <= 0) {
    if (message && message.length <= 500) {
      const apiKey = env.SENDINBLUE_KEY as string;
      const apiUrl = "https://api.sendinblue.com/v3/smtp/email";

      const sendinblueData = {
        sender: {
          name: "freno.me",
          email: "michael@freno.me",
        },
        to: [
          {
            email: "michael@freno.me",
          },
        ],
        htmlContent: `<html><head></head><body><div>Request Name: ${name}</div><div>Request Email: ${email}</div><div>Request Message: ${message}</div></body></html>`,
        subject: `freno.me Contact Request`,
      };
      try {
        const res = await fetch(apiUrl, {
          method: "POST",
          headers: {
            accept: "application/json",
            "api-key": apiKey,
            "content-type": "application/json",
          },
          body: JSON.stringify(sendinblueData),
        });
        const exp = new Date(Date.now() + 1 * 60 * 1000);
        cookies().set("contactRequestSent", exp.toUTCString());
        return "email sent";
      } catch (e) {
        console.log(e);
        return "SMTP server error: Sorry! You can reach me at michael@freno.me";
      }
    }
    return "message too long!";
  }
  return "countdown not expired";
}

interface deletePostInput {
  type: string;
  postId: number;
}
export async function deletePost({ type, postId }: deletePostInput) {
  const cookie = cookies().get("userIDToken");
  if (cookie && cookie.value == env.ADMIN_ID) {
    try {
      const conn = ConnectionFactory();
      const query = `DELETE FROM ${type} WHERE id = ?`;
      const params = [postId];
      const res = await conn.execute(query, params);
      console.log(res.statement);
      const commentDeleteQuery = `DELETE FROM Comment WHERE ${type}_id = ?`;
      const commentDeleteParams = [postId];
      const commentDeleteConn = await conn.execute(
        commentDeleteQuery,
        commentDeleteParams
      );
      console.log(commentDeleteConn.statement);
      return "good";
    } catch (e) {
      console.log(e);
      return "failure. check server logs";
    }
  } else {
    console.log("unauthorized");
    return "unauthorized";
  }
}
interface DeleteCommentInput {
  commentID: number;
}
export async function deleteCommentByUser({ commentID }: DeleteCommentInput) {
  const cookie = cookies().get("userIDToken");
  const conn = ConnectionFactory();
  const query = `SELECT FROM Comment WHERE id = ?`;
  const params = [cookie?.value];
  const res = await conn.execute(query, params);
  if ((res.rows[0] as Comment).commenter_id == cookie?.value) {
    try {
      const deletionQuery = `UPDATE Comment SET body = ? commenter_id = ? WHERE id = ?`;
      const deletionParams = ["[comment removed by user]", 0, commentID];
      const deletionRes = await conn.execute(deletionQuery, deletionParams);
      console.log(deletionRes.statement);
      return "good";
    } catch (e) {
      console.log(e);
      return "failure. check server logs";
    }
  }
  return "unauthorized";
}
export async function deleteCommentByAdmin({ commentID }: DeleteCommentInput) {
  const cookie = cookies().get("userIDToken");
  if (cookie && cookie.value == env.ADMIN_ID) {
    try {
      const conn = ConnectionFactory();
      const deletionQuery = `UPDATE Comment SET body = ? commenter_id = ? WHERE id = ?`;
      const deletionParams = ["[comment removed by admin]", 0, commentID];
      const deletionRes = await conn.execute(deletionQuery, deletionParams);
      console.log(deletionRes.statement);
      return "good";
    } catch (e) {
      console.log(e);
      return "failure. check server logs";
    }
  }
  return "unauthorized";
}
interface incrementReadsInput {
  postID: number;
  postType: "Blog" | "Project";
}
export async function incrementReads({
  postID,
  postType,
}: incrementReadsInput) {
  const conn = ConnectionFactory();
  const query = `UPDATE ${postType} SET reads = reads + 1 WHERE id=?`;
  const params = [postID];
  await conn.execute(query, params);
}
