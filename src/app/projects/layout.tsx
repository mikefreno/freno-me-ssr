import Navbar from "@/components/Navbar";

export const metadata = {
  title: "Projects | Michael Freno",
  description: "Project Pages",
};

export default async function NonRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <section>{children}</section>;
}
