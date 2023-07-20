export const metadata = {
  title: "Password Reset Form",
  description: "Password Reset Form",
};

export default async function NonRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <section>{children}</section>;
}
