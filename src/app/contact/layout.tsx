import Navbar from "@/components/Navbar-client";
import NextTopLoader from "nextjs-toploader";

export const metadata = {
  title: "Contact | Michael Freno",
  description: "Contact Me",
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
