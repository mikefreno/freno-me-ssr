import LoadingSpinner from "@/components/LoadingSpinner";
import Navbar from "@/components/Navbar-client";
import NextTopLoader from "nextjs-toploader";
import { Suspense } from "react";

export const metadata = {
  title: "Account | Michael Freno",
  description: "Accounts",
};

export default async function NonRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      <NextTopLoader showSpinner={false} color="#3b82f6" />
      {children}
    </section>
  );
}
