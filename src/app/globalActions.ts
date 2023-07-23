"use server";

import { env } from "@/env.mjs";
import { cookies } from "next/headers";

export async function signOut() {
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
