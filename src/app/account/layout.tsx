import NextTopLoader from "nextjs-toploader";

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
