"use server";

import { env } from "@/env.mjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function signOut() {
  //cookie destruction
  cookies().set({
    name: "emailToken",
    value: "null",
    maxAge: 0,
    expires: 0,
  });
  cookies().set({
    name: "userIDToken",
    value: "null",
    maxAge: 0,
    expires: 0,
  });
  redirect(`${env.NEXT_PUBLIC_DOMAIN}/login`);
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
