"use server";

import { env } from "@/env.mjs";
import { cookies } from "next/headers";

export async function SendDeletionRequestEmail(email: string) {
  const contactExp = cookies().get("deletionRequestSent");
  let remaining = 0;
  if (contactExp) {
    const expires = new Date(contactExp?.value);
    remaining = expires.getTime() - Date.now();
  }
  if (remaining <= 0) {
    const apiKey = env.SENDINBLUE_KEY as string;
    const apiUrl = "https://api.sendinblue.com/v3/smtp/email";

    const sendinblueMyData = {
      sender: {
        name: "freno.me",
        email: "michael@freno.me",
      },
      to: [
        {
          email: "michael@freno.me",
        },
      ],
      htmlContent: `<html><head></head><body><div>Request Name: Life and Lineage Account Deletion</div><div>Request Email: ${email}</div></body></html>`,
      subject: `Life and Lineage Acct Deletion`,
    };
    const sendinblueUserData = {
      sender: {
        name: "freno.me",
        email: "michael@freno.me",
      },
      to: [
        {
          email: email,
        },
      ],
      htmlContent: `<html><head></head><body><div>Request Name: Life and Lineage Account Deletion</div><div>Account to delete: ${email}</div><div>You can email michael@freno.me in the next 24hrs to cancel the deletion, email with subject line "Account Deletion Cancellation"</div></body></html>`,
      subject: `Life and Lineage Acct Deletion`,
    };
    try {
      await fetch(apiUrl, {
        method: "POST",
        headers: {
          accept: "application/json",
          "api-key": apiKey,
          "content-type": "application/json",
        },
        body: JSON.stringify(sendinblueMyData),
      });
      await fetch(apiUrl, {
        method: "POST",
        headers: {
          accept: "application/json",
          "api-key": apiKey,
          "content-type": "application/json",
        },
        body: JSON.stringify(sendinblueUserData),
      });
      const exp = new Date(Date.now() + 1 * 60 * 1000);
      cookies().set("contactRequestSent", exp.toUTCString());
      return "request sent";
    } catch (e) {
      console.log(e);
      return "SMTP server error: Sorry! You can reach me at michael@freno.me";
    }
  }
  return "countdown not expired";
}
