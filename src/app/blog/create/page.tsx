import CreationClient from "@/components/CreationClient";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Suspense } from "react";

export default async function BlogCreation() {
  return (
    <>
      <Suspense
        fallback={
          <div className="pt-48">
            <LoadingSpinner height={48} width={48} />
          </div>
        }
      >
        <CreationClient type={"blog"} />
      </Suspense>
    </>
  );
}
