"use client";

import { useEffect, useRef, useState } from "react";
import { sendContactRequest } from "@/app/globalActions";
import Link from "next/link";
import GitHub from "@/icons/GitHub";
import LinkedIn from "@/icons/LinkedIn";
import Cookies from "js-cookie";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import LoadingSpinner from "@/components/LoadingSpinner";
import RevealControl from "@/components/RevealDropDown";

export default function ContactClient(props: {
  user: {
    id: string;
    email: string | undefined;
    emailVerified: boolean;
    image: string | null;
    displayName: string | undefined;
    provider: string | undefined;
    hasPassword: boolean;
  } | null;
  status: number;
  viewer: string;
}) {
  const [countDown, setCountDown] = useState<number>(0);
  const [emailSent, setEmailSent] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const timerIdRef = useRef<number | NodeJS.Timeout | null>(null);

  const calcRemainder = (timer: string) => {
    const expires = new Date(timer);
    const remaining = expires.getTime() - Date.now();
    const remainingInSeconds = remaining / 1000;

    if (remainingInSeconds <= 0) {
      setCountDown(0);
      if (timerIdRef.current !== null) {
        clearInterval(timerIdRef.current);
      }
    } else {
      setCountDown(remainingInSeconds);
    }
  };

  useEffect(() => {
    const timer = Cookies.get("contactRequestSent");
    if (timer) {
      timerIdRef.current = setInterval(() => calcRemainder(timer), 1000);
      return () => {
        if (timerIdRef.current !== null) {
          clearInterval(timerIdRef.current);
        }
      };
    }
  }, []);

  const sendEmailTrigger = async (formData: FormData) => {
    //e.preventDefault();
    //const formData = new FormData(e.target);

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const message = formData.get("message") as string;

    if (name && email && message) {
      setLoading(true);
      const res = await sendContactRequest({
        name,
        email,
        message,
      });
      if (res == "email sent") {
        setEmailSent(true);
        const timer = Cookies.get("contactRequestSent");
        if (timer) {
          if (timerIdRef.current !== null) {
            clearInterval(timerIdRef.current);
          }
          timerIdRef.current = setInterval(() => calcRemainder(timer), 1000);
        }
      } else if (res) {
        setError(res);
      }
    }
    setLoading(false);
  };

  const LineageQuestionsDropDown = () => {
    return (
      <div className="py-12 mx-auto px-4 md:w-3/4 md:flex-row lg:w-1/2">
        <RevealControl title={"Questions about Life and Lineage?"}>
          <div>
            Feel free to use the form above, I will respond as quickly as
            possible, however, you may find an answer to your question in the
            following.
          </div>
          <ol>
            <div className="py-2">
              <div className="pb-2 text-lg">
                <span className="-ml-4 pr-2">1.</span> Personal Information
              </div>
              <div className="pl-4">
                <div className="pb-2">
                  You can find the entire privacy policy{" "}
                  <Link
                    href="/privacy-policy/life-and-lineage"
                    className="text-blue-400 underline-offset-4 hover:underline"
                  >
                    here
                  </Link>
                  .
                </div>
              </div>
            </div>
            <div className="py-2">
              <div className="pb-2 text-lg">
                <span className="-ml-4 pr-2">2.</span> Remote Backups
              </div>
              <div className="pl-4">
                <em>Life and Lineage</em> uses a per-user database approach for
                its remote storage, this provides better separation of users and
                therefore privacy, and it makes requesting the removal of your
                data simpler, you can even request the database dump if you so
                choose. This isn&apos;t particularly expensive, but not free for
                n users, so use of this feature requires a purchase of an
                IAP(in-app purchase) - this can be the specific IAP for the
                remote save feature, and any other IAP will also unlock this
                feature.
              </div>
            </div>
            <div className="py-2">
              <div className="pb-2 text-lg">
                <span className="-ml-4 pr-2">3.</span> Cross Device Play
              </div>
              <div className="pl-4">
                You can use the above mentioned remote-backups to save progress
                between devices/platforms.
              </div>
            </div>
            <div className="py-2">
              <div className="pb-2 text-lg">
                <span className="-ml-4 pr-2">4.</span> Online Requirements
              </div>
              <div className="pl-4">
                Currently, the only time you need to be online is for remote
                save access. There are plans for pvp, which will require an
                internet connection, but this is not implemented at time of
                writing.
              </div>
            </div>
            <div className="py-2">
              <div className="pb-2 text-lg">
                <span className="-ml-4 pr-2">5.</span> Microtransactions
              </div>
              <div className="pl-4">
                Microtransactions are not required to play or complete the game,
                the game can be fully completed without spending any money,
                however 2 of the classes(necromancer and ranger) are pay-walled.
                Microtransactions are supported cross-platform, so no need to
                pay for each device, you simply need to login to your
                gmail/apple/email account. This would require first creating a
                character, signing in under options{">"}remote backups first.
              </div>
            </div>
          </ol>
        </RevealControl>
      </div>
    );
  };

  const renderTime = () => {
    return (
      <div className="timer">
        <div className="value">{countDown.toFixed(0)}</div>
      </div>
    );
  };
  return (
    <>
      <div className="flex min-h-screen w-full justify-center">
        <div className="pt-[20vh]">
          <div className="text-center text-3xl tracking-widest dark:text-white">
            Contact
          </div>
          {props.viewer !== "lineage" && (
            <div className="text-center text-xl mt-4 -mb-4 tracking-widest dark:text-white">
              (for this website or any of my apps...)
            </div>
          )}
          {props.viewer === "lineage" && <LineageQuestionsDropDown />}
          <form action={sendEmailTrigger} className="min-w-[85vw] px-4">
            <div
              className={`flex w-full flex-col justify-evenly pt-6 ${
                props.viewer !== "lineage" ? "md:mt-24" : ""
              }`}
            >
              <div className="mx-auto w-full justify-evenly md:flex md:w-3/4 md:flex-row lg:w-1/2">
                <div className="input-group md:mx-4">
                  <input
                    type="text"
                    required
                    name="name"
                    defaultValue={
                      props.user?.displayName ? props.user.displayName : ""
                    }
                    placeholder=" "
                    className="underlinedInput w-full bg-transparent"
                  />
                  <span className="bar"></span>
                  <label className="underlinedInputLabel">Name</label>
                </div>
                <div className="input-group md:mx-4">
                  <input
                    type="email"
                    required
                    name="email"
                    defaultValue={props.user?.email ? props.user.email : ""}
                    placeholder=" "
                    className="underlinedInput w-full bg-transparent"
                  />
                  <span className="bar"></span>
                  <label className="underlinedInputLabel">Email</label>
                </div>
              </div>
              <div className="mx-auto w-full pt-6 md:w-3/4 md:pt-12 lg:w-1/2">
                <div className="textarea-group">
                  <textarea
                    required
                    name="message"
                    placeholder=" "
                    className="underlinedInput w-full bg-transparent"
                    rows={4}
                  />
                  <span className="bar" />
                  <label className="underlinedInputLabel">Message</label>
                </div>
              </div>
              <div className="mx-auto flex w-full justify-end pt-4 md:w-3/4 lg:w-1/2">
                {countDown > 0 ? (
                  <CountdownCircleTimer
                    isPlaying
                    duration={60}
                    initialRemainingTime={countDown}
                    size={48}
                    strokeWidth={6}
                    colors={"#60a5fa"}
                    colorsTime={undefined}
                    onComplete={() => ({ shouldRepeat: false })}
                  >
                    {renderTime}
                  </CountdownCircleTimer>
                ) : (
                  <button
                    type="submit"
                    disabled={loading}
                    className={`${
                      loading
                        ? "bg-zinc-400"
                        : "bg-blue-400 hover:bg-blue-500 active:scale-90 dark:bg-blue-600 dark:hover:bg-blue-700"
                    } flex w-36 justify-center rounded py-3 font-light text-white shadow-lg shadow-blue-300 transition-all duration-300 ease-out dark:shadow-blue-700`}
                  >
                    {loading ? (
                      <LoadingSpinner height={24} width={24} />
                    ) : (
                      "Send Message"
                    )}
                  </button>
                )}
              </div>
            </div>
          </form>
          {props.viewer !== "lineage" && <LineageQuestionsDropDown />}
          <div
            className={`${
              emailSent
                ? "text-green-400"
                : error !== ""
                ? "text-red-400"
                : "user-select opacity-0"
            } flex justify-center text-center italic transition-opacity duration-300 ease-in-out`}
          >
            {emailSent ? "Email Sent!" : error}
          </div>
          <ul className="icons flex justify-center pb-6 pt-24">
            <li>
              <Link
                href="https://github.com/MikeFreno/"
                target="_blank"
                rel="noreferrer"
                className="shaker rounded-full border-zinc-800 dark:border-zinc-300"
              >
                <span className="m-auto p-2">
                  <GitHub height={24} width={24} fill={undefined} />
                </span>
              </Link>
            </li>
            <li>
              <Link
                href="https://www.linkedin.com/in/michael-freno-176001256/"
                target="_blank"
                rel="noreferrer"
                className="shaker rounded-full border-zinc-800 dark:border-zinc-300"
              >
                <span className="m-auto rounded-md p-2">
                  <LinkedIn height={24} width={24} fill={undefined} />
                </span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
