import "@/styles/globals.css";
import "@/styles/content.scss";
import { Source_Code_Pro } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";

const SCP = Source_Code_Pro({ subsets: ["latin"] });

export const metadata = {
  title: "Michael Freno - Portfolio",
  description:
    "Michael Freno's Portfolio - Software Engineer: Explore his projects, blog, and more.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <link rel="icon" href="/favicon.ico" sizes="any" />
      <body
        className={`${SCP.className} bg-zinc-50 text-black dark:bg-zinc-800 dark:text-white`}
      >
        <NextTopLoader showSpinner={false} color="#3b82f6" />
        {children}
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
