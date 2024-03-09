"use client";

import { useEffect, useRef, useState } from "react";
import { sendContactRequest } from "@/app/globalActions";
import Link from "next/link";
import GitHub from "@/icons/GitHub";
import LinkedIn from "@/icons/LinkedIn";
import Cookies from "js-cookie";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import LoadingSpinner from "@/components/LoadingSpinner";

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
}) {
  const [countDown, setCountDown] = useState<number>(0);
  const [emailSent, setEmailSent] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const emailRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);
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
          <form action={sendEmailTrigger} className="min-w-[85vw]">
            <div className="flex w-full flex-col justify-evenly pt-6 md:mt-24">
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
