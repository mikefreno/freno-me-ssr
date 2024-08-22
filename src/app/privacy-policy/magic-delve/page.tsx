import Head from "next/head";
import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function PrivacyPolicy() {
  return (
    <>
      <div className="bg-zinc-100 dark:bg-zinc-900">
        <Head>
          <title>Privacy Policy | Magic Delve!</title>
          <meta name="description" content="Magic Delve's Privacy Policy" />
        </Head>
        <Navbar />
        <div className="min-h-screen px-[8vw] py-[8vh]">
          <div className="py-4 text-xl">Magic Delve&apos;s Privacy Policy</div>
          <div className="py-2">Last Updated: December 21, 2023</div>
          <div className="py-2">
            Welcome to Magic Delve! (&apos;We&apos; , &apos;Us&apos;,
            &apos;Our&apos;). Your privacy is important to us. For that reason,
            our app, &quot;Magic Delve&quot; has been designed to provide our
            users with a secure environment. This privacy policy will help you
            understand our policies and procedures related to the
            non-collection, non-use, and non-storage of personal information
            from our users.
          </div>
          <ol>
            <div className="py-2">
              <div className="pb-2 text-lg">
                <span className="-ml-4 pr-2">1.</span> Personal Information
              </div>
              <div className="pl-4"></div>
            </div>

            <div className="py-2">
              <div className="pb-2 text-lg">
                <span className="-ml-4 pr-2">2.</span> Third-Party Access
              </div>
              <div className="pb-2 pl-4"></div>
            </div>

            <div className="py-2">
              <div className="pb-2 text-lg">
                <span className="-ml-4 pr-2">3.</span> Security
              </div>
              <div className="pb-2 pl-4"></div>
            </div>

            <div className="py-2">
              <div className="pb-2 text-lg">
                <span className="-ml-4 pr-2">4.</span> Changes to the Privacy
                Policy
              </div>
              <div className="pb-2 pl-4">
                <div className="-ml-6">(a) Updates:</div> We may update this
                privacy policy periodically. Any changes to this privacy policy
                will be posted on this page.
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
