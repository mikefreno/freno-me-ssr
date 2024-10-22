import { DeletionForm } from "./DeletionForm";

export default async function MaicDelveAccountDeletion() {
  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-12">
      <div className="w-full justify-center">
        <div className="text-xl">
          <em>What will happen</em>:
        </div>
        Once you send, if a match to the email provided is found in our system,
        a 24hr grace period is started where you can request a cancellation of
        the account deletion. Once the grace period ends, the account&apos;s
        entry in our central database will be completely removed, and your
        individual database storing your remote saves will also be deleted. No
        data related to the account is retained in any way.
      </div>

      <DeletionForm />
    </div>
  );
}
