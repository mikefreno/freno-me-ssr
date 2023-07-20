export const metadata = {
  title: "Password Reset Request",
  description: "Password Reset Request",
};

export default async function NonRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <section>{children}</section>;
}
