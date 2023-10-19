"use client";
import { useEffect, useRef, useState } from "react";
import { requestPasswordReset } from "./actions";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import Cookies from "js-cookie";

export default function PasswordResetPage() {
  const emailRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [countDown, setCountDown] = useState<number>(0);
  const [showSuccessMessage, setShowSuccessMessage] = useState<boolean>(false);

  const timerIdRef = useRef<number | NodeJS.Timeout | null>(null);

  useEffect(() => {
    const timer = Cookies.get("passwordResetRequested");
    if (timer) {
      timerIdRef.current = setInterval(() => calcRemainder(timer), 1000);
      return () => {
        if (timerIdRef.current !== null) {
          clearInterval(timerIdRef.current);
        }
      };
    }
  }, []);

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

  const requestPasswordResetTrigger = async (e: React.FormEvent) => {
    e.preventDefault();
    if (emailRef.current) {
      setLoading(true);
      const res = await requestPasswordReset(emailRef.current.value);
      if (res == "email sent") {
        setShowSuccessMessage(true);
        const timer = Cookies.get("passwordResetRequested");
        if (timer) {
          if (timerIdRef.current !== null) {
            clearInterval(timerIdRef.current as unknown as number);
          }
          timerIdRef.current = setInterval(() => {
            calcRemainder(timer);
            setLoading(false);
          }, 1000);
        }
      } else {
        setLoading(false);
      }
    }
  };

  const renderTime = () => {
    return (
      <div className="timer">
        <div className="value">{countDown.toFixed(0)}</div>
      </div>
    );
  };

  return (
    <div>
      <div className="pt-24 text-center text-xl">Password Reset Request</div>
      <form
        onSubmit={(e) => requestPasswordResetTrigger(e)}
        className="mt-4 flex w-full justify-center"
      >
        <div className="flex flex-col justify-center">
          <div className="input-group mx-4">
            <input
              ref={emailRef}
              name="email"
              type="text"
              required
              disabled={loading}
              placeholder=" "
              className="underlinedInput w-full bg-transparent"
            />
            <span className="bar"></span>
            <label className="underlinedInputLabel">Enter Email</label>
          </div>
          {countDown > 0 ? (
            <div className="mx-auto pt-4">
              <CountdownCircleTimer
                isPlaying
                duration={300}
                initialRemainingTime={countDown}
                size={48}
                strokeWidth={6}
                colors={"#60a5fa"}
                colorsTime={undefined}
                onComplete={() => ({ shouldRepeat: false })}
              >
                {renderTime}
              </CountdownCircleTimer>
            </div>
          ) : (
            <button
              type={"submit"}
              disabled={loading}
              className={`${
                loading
                  ? "bg-zinc-400"
                  : "bg-blue-400 hover:bg-blue-500 active:scale-90 dark:bg-blue-600 dark:hover:bg-blue-700"
              } flex justify-center rounded transition-all duration-300 ease-out my-6 px-4 py-2 text-white`}
            >
              Request Password Reset
            </button>
          )}
        </div>
      </form>
      <div
        className={`${
          showSuccessMessage ? "" : "select-none opacity-0"
        } text-green-500 italic transition-opacity flex justify-center duration-300 ease-in-out`}
      >
        If email exists, you will receive an email shortly!
      </div>
    </div>
  );
}
