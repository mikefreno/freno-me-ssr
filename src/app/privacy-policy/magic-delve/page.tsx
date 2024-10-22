import Link from "next/link";

export default function PrivacyPolicy() {
  return (
    <>
      <div className="bg-zinc-100 dark:bg-zinc-900">
        <div className="min-h-screen px-[8vw] py-[8vh]">
          <div className="py-4 text-xl">Magic Delve's Privacy Policy</div>
          <div className="py-2">Last Updated: October 22, 2024</div>
          <div className="py-2">
            Welcome to Magic Delve ('We', 'Us', 'Our'). Your privacy is
            important to us. This privacy policy will help you understand our
            policies and procedures related to the collection, use, and storage
            of personal information from our users.
          </div>
          <ol>
            <div className="py-2">
              <div className="pb-2 text-lg">
                <span className="-ml-4 pr-2">1.</span> Personal Information
              </div>
              <div className="pl-4">
                <div className="pb-2">
                  <div className="-ml-6">(a) Collection of Personal Data:</div>{" "}
                  Magic Delve collects and stores personal data only if users
                  opt to use the remote saving feature. The information
                  collected includes email address, and if using an OAuth
                  provider - first name, and last name. This information is used
                  solely for the purpose of providing and managing the remote
                  saving feature. It is and never will be shared with a third
                  party.
                </div>
                <div className="pb-2">
                  <div className="-ml-6">(b) Data Removal:</div> Users can
                  request the removal of all information related to them by
                  visiting{" "}
                  <Link
                    href="/deletion/magic-delve"
                    className="text-blue-400 underline-offset-4 hover:underline"
                  >
                    this page
                  </Link>{" "}
                  and filling out the provided form.
                </div>
              </div>
            </div>

            <div className="py-2">
              <div className="pb-2 text-lg">
                <span className="-ml-4 pr-2">2.</span> Third-Party Access
              </div>
              <div className="pb-2 pl-4">
                <div className="-ml-6">(a) Limited Third-Party Access:</div> We
                do not share or sell user information to third parties. However,
                we do utilize third-party services for crash reporting and
                performance profiling. These services do not have access to
                personal user information and only receive anonymized data
                related to app performance and stability.
              </div>
            </div>

            <div className="py-2">
              <div className="pb-2 text-lg">
                <span className="-ml-4 pr-2">3.</span> Security
              </div>
              <div className="pb-2 pl-4">
                <div className="-ml-6">(a) Data Protection:</div>Magic Delve
                takes appropriate measures to protect the personal information
                of users who opt for the remote saving feature. We implement
                industry-standard security protocols to prevent unauthorized
                access, disclosure, alteration, or destruction of user data.
              </div>
            </div>

            <div className="py-2">
              <div className="pb-2 text-lg">
                <span className="-ml-4 pr-2">4.</span> Changes to the Privacy
                Policy
              </div>
              <div className="pb-2 pl-4">
                <div className="-ml-6">(a) Updates:</div> We may update this
                privacy policy periodically. Any changes to this privacy policy
                will be posted on this page. We encourage users to review this
                policy regularly to stay informed about how we protect their
                information.
              </div>
            </div>

            <div className="py-2">
              <div className="pb-2 text-lg">
                <span className="-ml-4 pr-2">5.</span> Contact Us
              </div>
              <div className="pb-2 pl-4">
                <div className="-ml-6">(a) Reaching Out:</div> If there are any
                questions or comments regarding this privacy policy, you can
                contact us{" "}
                <Link
                  href="/contact"
                  className="text-blue-400 underline-offset-4 hover:underline"
                >
                  here
                </Link>
                .
              </div>
            </div>
          </ol>
        </div>
      </div>
    </>
  );
}
