import { getPrivilegeLevel } from "@/app/utils";
import CreationClient from "@/components/CreationClient";
import LoadingSpinner from "@/components/LoadingSpinner";
import { env } from "@/env.mjs";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function BlogCreation() {
  const privilegeLevel = await getPrivilegeLevel();
  if (privilegeLevel == "admin") {
    return (
      <>
        <Suspense
          fallback={
            <div className="pt-48">
              <LoadingSpinner height={48} width={48} />
            </div>
          }
        >
          <CreationClient type={"project"} />
        </Suspense>
      </>
    );
  } else {
    redirect(`${env.NEXT_PUBLIC_DOMAIN}/401`);
  }
}
