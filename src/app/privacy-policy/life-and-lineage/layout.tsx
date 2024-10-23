import Navbar from "@/components/Navbar";
import NextTopLoader from "nextjs-toploader";

export const metadata = {
  title: "Privacy Policy | Life and Lineage",
  description: "Life and Lineage Privacy Policy",
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
