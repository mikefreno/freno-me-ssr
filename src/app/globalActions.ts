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

export async function sendContactRequest(data: FormData) {
  const name = data.get("name")?.toString();
  const email = data.get("email")?.toString();
  const message = data.get("message")?.toString();

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
    await fetch(apiUrl, {
      method: "POST",
      headers: {
        accept: "application/json",
        "api-key": apiKey,
        "content-type": "application/json",
      },
      body: JSON.stringify(sendinblueData),
    });
  }
}
