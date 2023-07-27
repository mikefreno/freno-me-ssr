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

  const sendEmailTrigger = async (e: React.FormEvent) => {
    e.preventDefault();
    if (nameRef.current && messageRef.current && emailRef.current) {
      setLoading(true);
      const res = await sendContactRequest({
        name: nameRef.current.value,
        email: emailRef.current.value,
        message: messageRef.current.value,
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
      <div className="flex min-h-screen justify-center w-full">
        <div className="pt-[20vh]">
          <div className="text-center text-3xl tracking-widest dark:text-white">
            Contact
          </div>
          <form onSubmit={sendEmailTrigger} className="min-w-[85vw]">
            <div className="pt-6 md:mt-24 flex flex-col justify-evenly w-full">
              <div className="md:flex md:flex-row justify-evenly mx-auto w-full md:w-3/4 lg:w-1/2">
                <div className="input-group md:mx-4">
                  <input
                    type="text"
                    required
                    name="name"
                    defaultValue={
                      props.user?.displayName ? props.user.displayName : ""
                    }
                    placeholder=" "
                    className="bg-transparent underlinedInput w-full"
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
                    className="bg-transparent underlinedInput w-full"
                  />
                  <span className="bar"></span>
                  <label className="underlinedInputLabel">Email</label>
                </div>
              </div>
              <div className="pt-6 md:pt-12 mx-auto w-full md:w-3/4 lg:w-1/2">
                <div className="textarea-group">
                  <textarea
                    required
                    name="message"
                    placeholder=" "
                    className="bg-transparent underlinedInput w-full"
                    rows={4}
                  />
                  <span className="bar" />
                  <label className="underlinedInputLabel">Message</label>
                </div>
              </div>
              <div className="flex justify-end pt-4 w-full md:w-3/4 mx-auto lg:w-1/2">
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
                        : "bg-blue-400 dark:bg-blue-600 hover:bg-blue-500 dark:hover:bg-blue-700 active:scale-90"
                    } flex w-36 justify-center rounded transition-all duration-300 ease-out py-3 text-white shadow-lg shadow-blue-300 dark:shadow-blue-700`}
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
            } text-center italic transition-opacity flex justify-center duration-300 ease-in-out`}
          >
            {emailSent ? "Email Sent!" : error}
          </div>
          <ul className="icons flex justify-center pt-24 pb-6">
            <li>
              <Link
                href="https://github.com/MikeFreno/"
                target="_blank"
                rel="noreferrer"
                className="rounded-full shaker border-zinc-800 dark:border-zinc-300"
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
                className="rounded-full shaker border-zinc-800 dark:border-zinc-300"
              >
                <span className="m-auto p-2 rounded-md">
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
