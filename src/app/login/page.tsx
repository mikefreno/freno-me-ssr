"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import GoogleLogo from "@/icons/GoogleLogo";
import GitHub from "@/icons/GitHub";
import {
  emailLinkLogin,
  emailPasswordLogin,
  emailRegistration,
} from "./actions";
import { env } from "@/env.mjs";
import Cookies from "js-cookie";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import { useRouter } from "next/navigation";
import Eye from "@/icons/Eye";
import EyeSlash from "@/icons/EyeSlash";

export default function LoginPage() {
  const [register, setRegister] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [usePassword, setUsePassword] = useState<boolean>(false);
  const [countDown, setCountDown] = useState<number>(0);
  const [emailSent, setEmailSent] = useState<boolean>(false);
  const [showPasswordError, setShowPasswordError] = useState<boolean>(false);
  const [showPasswordSuccess, setShowPasswordSuccess] =
    useState<boolean>(false);
  const [showPasswordInput, setShowPasswordInput] = useState<boolean>(false);
  const [showPasswordConfInput, setShowPasswordConfInput] =
    useState<boolean>(false);
  const [passwordsMatch, setPasswordsMatch] = useState<boolean>(false);
  const [showPasswordLengthWarning, setShowPasswordLengthWarning] =
    useState<boolean>(false);
  const [passwordLengthSufficient, setPasswordLengthSufficient] =
    useState<boolean>(false);
  const [passwordBlurred, setPasswordBlurred] = useState(false);
  const rememberMeRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const passwordConfRef = useRef<HTMLInputElement>(null);
  const timerIdRef = useRef<number | NodeJS.Timeout | null>(null);

  const router = useRouter();

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
    const timer = Cookies.get("emailLoginLinkRequested");
    if (timer) {
      timerIdRef.current = setInterval(() => calcRemainder(timer), 1000);
      return () => {
        if (timerIdRef.current !== null) {
          clearInterval(timerIdRef.current);
        }
      };
    }
  }, []);

  const formHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (register) {
      if (emailRef.current && passwordRef.current && passwordConfRef.current) {
        const res = await emailRegistration(
          emailRef.current.value,
          passwordRef.current.value,
          passwordConfRef.current.value,
        );
        if (res && res !== "success") {
          setError(res);
        } else if (res == "success") {
          router.push("/account");
        }
      }
    } else if (usePassword) {
      if (emailRef.current && passwordRef.current && rememberMeRef.current) {
        const res = await emailPasswordLogin(
          emailRef.current.value,
          passwordRef.current.value,
          rememberMeRef.current.checked,
        );
        if (res == "no-match") {
          setShowPasswordError(true);
        } else if (res == "success") {
          setShowPasswordSuccess(true);
          router.back();
          router.refresh();
        }
      }
    } else {
      if (emailRef.current && rememberMeRef.current) {
        const res = await emailLinkLogin(
          emailRef.current.value,
          rememberMeRef.current.checked,
        );
        if (res == "email sent") {
          setEmailSent(true);
          const timer = Cookies.get("emailLoginLinkRequested");
          if (timer) {
            if (timerIdRef.current !== null) {
              clearInterval(timerIdRef.current);
            }
            timerIdRef.current = setInterval(() => calcRemainder(timer), 1000);
          }
        }
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

  const checkForMatch = (newPassword: string, newPasswordConf: string) => {
    if (newPassword === newPasswordConf) {
      setPasswordsMatch(true);
    } else {
      setPasswordsMatch(false);
    }
  };

  const checkPasswordLength = (password: string) => {
    if (password.length >= 8) {
      setPasswordLengthSufficient(true);
      setShowPasswordLengthWarning(false);
    } else {
      setPasswordLengthSufficient(false);
      if (passwordBlurred) {
        setShowPasswordLengthWarning(true);
      }
    }
  };

  const passwordLengthBlurCheck = () => {
    if (
      !passwordLengthSufficient &&
      passwordRef.current &&
      passwordRef.current.value !== ""
    ) {
      setShowPasswordLengthWarning(true);
    }
    setPasswordBlurred(true);
  };

  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    checkPasswordLength(e.target.value);
  };

  const handlePasswordConfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (passwordRef.current) {
      checkForMatch(passwordRef.current.value, e.target.value);
    }
  };

  const handlePasswordBlur = () => {
    passwordLengthBlurCheck();
  };

  return (
    <>
      <div className="flex h-[100dvh] flex-row justify-evenly">
        <div className="hidden md:flex">
          <div className="vertical-rule-around z-0 flex justify-center">
            <picture className="-mr-8">
              <source
                srcSet="/WhiteLogo.png"
                media="(prefers-color-scheme: dark)"
              />
              <img src="/BlackLogo.png" alt="logo" width={64} height={64} />
            </picture>
          </div>
        </div>
        <div className="pt-24 md:pt-48">
          <div className="absolute -mt-12 text-center text-3xl italic text-red-400">
            {error == "passwordMismatch"
              ? "Passwords did not match!"
              : error == "duplicate"
              ? "Email Already Exists!"
              : null}
          </div>
          <div className="py-2 pl-6 text-2xl md:pl-0">
            {register ? "Register" : "Login"}
          </div>
          {!register ? (
            <div className="py-4 text-center md:min-w-[475px]">
              Don&apos;t have an account yet?
              <button
                onClick={() => {
                  setRegister(true);
                  setUsePassword(false);
                }}
                className="pl-1 text-blue-400 underline dark:text-blue-600"
              >
                Click here to Register
              </button>
            </div>
          ) : (
            <div className="py-4 text-center md:min-w-[475px]">
              Already have an account?
              <button
                onClick={() => {
                  setRegister(false);
                  setUsePassword(false);
                }}
                className="pl-1 text-blue-400 underline dark:text-blue-600"
              >
                Click here to Login
              </button>
            </div>
          )}
          <form onSubmit={formHandler} className="flex flex-col px-2 py-4">
            <div className="flex justify-center">
              <div className="input-group mx-4">
                <input
                  type="text"
                  required
                  ref={emailRef}
                  placeholder=" "
                  className="underlinedInput bg-transparent"
                />
                <span className="bar"></span>
                <label className="underlinedInputLabel">Email</label>
              </div>
            </div>
            {usePassword || register ? (
              <>
                <div className="-mt-4 flex justify-center">
                  <div className="input-group mx-4 flex">
                    <input
                      type={showPasswordInput ? "text" : "password"}
                      required
                      minLength={8}
                      ref={passwordRef}
                      onChange={register ? handleNewPasswordChange : () => null}
                      onBlur={register ? handlePasswordBlur : () => null}
                      placeholder=" "
                      className="underlinedInput bg-transparent"
                    />
                    <span className="bar"></span>
                    <label className="underlinedInputLabel">Password</label>
                  </div>
                  <button
                    onClick={() => {
                      setShowPasswordInput(!showPasswordInput);
                      passwordRef.current?.focus();
                    }}
                    className="absolute ml-60 mt-14"
                    type="button"
                  >
                    {showPasswordInput ? (
                      <Eye
                        height={24}
                        width={24}
                        strokeWidth={1}
                        className="stroke-zinc-900 dark:stroke-white"
                      />
                    ) : (
                      <EyeSlash
                        height={24}
                        width={24}
                        strokeWidth={1}
                        className="stroke-zinc-900 dark:stroke-white"
                      />
                    )}
                  </button>
                </div>
                <div
                  className={`${
                    showPasswordLengthWarning ? "" : "select-none opacity-0"
                  } text-center text-red-500 transition-opacity duration-200 ease-in-out`}
                >
                  Password too short! Min Length: 8
                </div>
              </>
            ) : null}
            {register ? (
              <>
                <div className="-mt-4 flex justify-center">
                  <div className="input-group mx-4">
                    <input
                      type={showPasswordConfInput ? "text" : "password"}
                      required
                      minLength={8}
                      ref={passwordConfRef}
                      onChange={handlePasswordConfChange}
                      placeholder=" "
                      className="underlinedInput bg-transparent"
                    />
                    <span className="bar"></span>
                    <label className="underlinedInputLabel">
                      Confirm Password
                    </label>
                  </div>
                  <button
                    onClick={() => {
                      setShowPasswordConfInput(!showPasswordConfInput);
                      passwordConfRef.current?.focus();
                    }}
                    className="absolute ml-60 mt-14"
                    type="button"
                  >
                    {showPasswordConfInput ? (
                      <Eye
                        height={24}
                        width={24}
                        strokeWidth={1}
                        className="stroke-zinc-900 dark:stroke-white"
                      />
                    ) : (
                      <EyeSlash
                        height={24}
                        width={24}
                        strokeWidth={1}
                        className="stroke-zinc-900 dark:stroke-white"
                      />
                    )}
                  </button>
                </div>
                <div
                  className={`${
                    !passwordsMatch &&
                    passwordLengthSufficient &&
                    passwordConfRef.current!.value.length >= 6
                      ? ""
                      : "select-none opacity-0"
                  } text-center text-red-500 transition-opacity duration-200 ease-in-out`}
                >
                  Passwords do not match!
                </div>
              </>
            ) : null}
            <div className="mx-auto flex pt-4">
              <input type="checkbox" className="my-auto" ref={rememberMeRef} />
              <div className="my-auto px-2 text-sm font-normal">
                Remember Me
              </div>
            </div>
            <div
              className={`${
                showPasswordError
                  ? "text-red-500"
                  : showPasswordSuccess
                  ? "text-green-500"
                  : "select-none opacity-0"
              }  flex min-h-[16px] justify-center italic transition-opacity duration-300 ease-in-out`}
            >
              {showPasswordError
                ? "Credentials did not match any record"
                : showPasswordSuccess
                ? "Login Success! Redirecting..."
                : ""}
            </div>
            <div className="flex justify-center py-4">
              {!register && !usePassword && countDown > 0 ? (
                <CountdownCircleTimer
                  isPlaying
                  duration={120}
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
                  type={"submit"}
                  disabled={loading}
                  className={`${
                    loading
                      ? "bg-zinc-400"
                      : "bg-blue-400 hover:bg-blue-500 active:scale-90 dark:bg-blue-600 dark:hover:bg-blue-700"
                  } flex w-36 justify-center rounded py-3 text-white shadow-lg shadow-blue-300 transition-all duration-300 ease-out dark:shadow-blue-700`}
                >
                  {register ? "Sign Up" : usePassword ? "Sign In" : "Get Link"}
                </button>
              )}
              {!register && !usePassword ? (
                <button
                  type="button"
                  onClick={() => setUsePassword(true)}
                  className="hover-underline-animation my-auto ml-2 px-2 text-sm"
                >
                  Use Password
                </button>
              ) : usePassword ? (
                <button
                  type="button"
                  onClick={() => setUsePassword(false)}
                  className="hover-underline-animation my-auto ml-2 px-2 text-sm"
                >
                  Use Email Link
                </button>
              ) : null}
            </div>
          </form>
          {usePassword ? (
            <div className="pb-4 text-center text-sm">
              Trouble Logging In?{" "}
              <Link
                className="text-blue-500 underline underline-offset-4 hover:text-blue-400"
                href={"/login/request-password-reset"}
              >
                Reset Password
              </Link>
            </div>
          ) : null}
          <div
            className={`${
              emailSent ? "" : "user-select opacity-0"
            } flex min-h-[16px] justify-center text-center italic text-green-400 transition-opacity duration-300 ease-in-out`}
          >
            {emailSent ? "Email Sent!" : ""}
          </div>
          <div className="rule-around text-center">Or</div>
          <div className="my-2 flex justify-center">
            <div className="mx-auto mb-4 flex flex-col">
              <Link
                href={`https://accounts.google.com/o/oauth2/v2/auth?client_id=${env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}&redirect_uri=https://www.freno.me/api/auth/callback/google&response_type=code&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email`}
                className="my-4 flex w-80 flex-row justify-between rounded border border-zinc-800 bg-white px-4 py-2 text-black shadow-md transition-all duration-300 ease-out hover:bg-zinc-100 active:scale-95 dark:border dark:border-zinc-50 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700"
              >
                {!register ? "Sign in " : "Register "} with Google
                <span className="my-auto">
                  <GoogleLogo height={24} width={24} />
                </span>
              </Link>
              <div className="px-4"></div>
              <Link
                href={`https://github.com/login/oauth/authorize?client_id=${env.NEXT_PUBLIC_GITHUB_CLIENT_ID}&redirect_uri=https://www.freno.me/api/auth/callback/github&scope=user`}
                className="my-4 flex w-80 flex-row justify-between rounded bg-zinc-600 px-4 py-2 text-white shadow-md transition-all duration-300 ease-out hover:bg-zinc-700 active:scale-95"
              >
                {!register ? "Sign in " : "Register "} with Github
                <span className="my-auto">
                  <GitHub height={24} width={24} fill={"white"} />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
