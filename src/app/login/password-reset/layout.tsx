import LoadingSpinner from "@/components/LoadingSpinner";
import { Suspense } from "react";

export const metadata = {
  title: "Password Reset Form",
  description: "Password Reset Form",
};

export default async function NonRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      <Suspense
        fallback={
          <div className="mx-auto pt-48">
            <LoadingSpinner height={64} width={64} />
          </div>
        }
      >
        {children}
      </Suspense>
    </section>
  );
}
