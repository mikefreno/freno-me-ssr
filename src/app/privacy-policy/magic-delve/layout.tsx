import Navbar from "@/components/Navbar";
import NextTopLoader from "nextjs-toploader";

export const metadata = {
  title: "Privacy Policy | Magic Delve",
  description: "Magic Delve Privacy Policy",
};

export default async function NonRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      <NextTopLoader showSpinner={false} color="#3b82f6" />
      <Navbar />
      {children}
    </section>
  );
}
