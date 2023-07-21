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
      <link rel="preload" as="image" href="/blur_SH_water.jpg" />
      <link rel="preload" as="image" href="/me_in_flannel.jpg" />
      <body
        className={`${SCP.className} bg-zinc-50 dark:bg-zinc-800 text-black dark:text-white`}
      >
        <Navbar />
        {children}
      </body>
    </html>
  );
}
