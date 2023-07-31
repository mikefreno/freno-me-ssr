import Navbar from "@/components/Navbar";
import NextTopLoader from "nextjs-toploader";

export const metadata = {
  title: "Blog | Michael Freno",
  description: "Blog Pages",
};

export default async function NonRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      <link rel="preload" href="/bitcoin.jpg" as="image" />
      <NextTopLoader showSpinner={false} color="#fb923c" />
      <Navbar />
      {children}
    </section>
  );
}
