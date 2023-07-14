import Navbar from "@/components/Navbar";

export const metadata = {
  title: "Blog | Michael Freno",
  description: "Blog Pages",
};

export default async function NonRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <section>{children}</section>;
}
