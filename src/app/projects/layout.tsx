import NextTopLoader from "nextjs-toploader";

export const metadata = {
  title: "Projects | Michael Freno",
  description: "Project Pages",
};

export default async function NonRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      <link rel="preload" as="image" href="/blueprint.jpg" />
      <NextTopLoader showSpinner={false} color="#3b82f6" />
      {children}
    </section>
  );
}
