import Navbar from "@/components/Navbar";
import "@/styles/globals.css";

import { Source_Code_Pro } from "next/font/google";

const SCP = Source_Code_Pro({ subsets: ["latin"] });

export const metadata = {
  title: "Michael Freno",
  description: "Software Engineer - Portfolio",
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
        className={`${SCP.className} bg-zinc-100 dark:bg-zinc-900 text-black dark:text-white`}
      >
        <Navbar />
        {children}
      </body>
    </html>
  );
}
