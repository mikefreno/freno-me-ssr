"use client";

import { useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { passwordReset } from "./actions";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import Link from "next/link";

export default function PasswordResetPage() {
  const newPasswordRef = useRef<HTMLInputElement>(null);
  const newPasswordConfRef = useRef<HTMLInputElement>(null);

  const [passwordBlurred, setPasswordBlurred] = useState(false);
  const [passwordChangeLoading, setPasswordChangeLoading] =
    useState<boolean>(false);
  const [passwordsMatch, setPasswordsMatch] = useState<boolean>(false);
  const [showPasswordLengthWarning, setShowPasswordLengthWarning] =
    useState<boolean>(false);
  const [passwordLengthSufficient, setPasswordLengthSufficient] =
    useState<boolean>(false);
  const [showRequestNewEmail, setShowRequestNewEmail] =
    useState<boolean>(false);
  const [countDown, setCountDown] = useState<boolean>(false);

  const searchParams = useSearchParams();

  const token = searchParams.get("token");

  const router = useRouter();

  const setNewPasswordTrigger = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowRequestNewEmail(false);
    if (newPasswordRef.current && newPasswordConfRef.current) {
      setPasswordChangeLoading(true);
      const res = await passwordReset(
        newPasswordRef.current.value,
        newPasswordConfRef.current.value,
        token as string
      );
      if (res == "success") {
        setCountDown(true);
      } else {
        setShowRequestNewEmail(true);
      }
      setPasswordChangeLoading(false);
    }
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
      newPasswordRef.current &&
      newPasswordRef.current.value !== ""
    ) {
      setShowPasswordLengthWarning(true);
    }
    setPasswordBlurred(true);
  };

  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    checkPasswordLength(e.target.value);
  };

  const handlePasswordConfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (newPasswordRef.current) {
      checkForMatch(newPasswordRef.current.value, e.target.value);
    }
  };

  const handlePasswordBlur = () => {
    passwordLengthBlurCheck();
  };

  const renderTime = (timeRemaining: number) => {
    if (timeRemaining == 0) {
      router.push("/login");
    }
    return (
      <div className="timer text-center">
        <div className="text-sm">Change Successful!</div>
        <div className="value text-3xl py-1">{timeRemaining}</div>
        <div className="text-sm">Redirecting...</div>
      </div>
    );
  };

  return (
    <div>
      <div className="text-center text-xl pt-24">Set New Password</div>
      <form
        onSubmit={(e) => setNewPasswordTrigger(e)}
        className="mt-4 flex justify-center w-full"
      >
        <div className="flex flex-col justify-center">
          <div className="input-group mx-4">
            <input
              ref={newPasswordRef}
              name="newPassword"
              type="password"
              required
              onChange={handleNewPasswordChange}
              onBlur={handlePasswordBlur}
              disabled={passwordChangeLoading}
              placeholder=" "
              className="bg-transparent underlinedInput w-full"
            />
            <span className="bar"></span>
            <label className="underlinedInputLabel">New Password</label>
          </div>

          <div
            className={`${
              showPasswordLengthWarning ? "" : "opacity-0 select-none"
            } transition-opacity text-center text-red-500 duration-200 ease-in-out`}
          >
            Password too short! Min Length: 8
          </div>
          <div className="-mt-6">
            <div className="input-group mx-4">
              <input
                ref={newPasswordConfRef}
                name="newPasswordConf"
                onChange={handlePasswordConfChange}
                type="password"
                required
                disabled={passwordChangeLoading}
                placeholder=" "
                className="bg-transparent underlinedInput w-full"
              />
              <span className="bar"></span>
              <label className="underlinedInputLabel">
                Password Confirmation
              </label>
            </div>
          </div>

          <div
            className={`${
              !passwordsMatch &&
              passwordLengthSufficient &&
              newPasswordConfRef.current!.value.length >= 6
                ? ""
                : "opacity-0 select-none"
            } transition-opacity text-center text-red-500 duration-200 ease-in-out`}
          >
            Passwords do not match!
          </div>

          {countDown ? (
            <div className="pt-4 mx-auto">
              <CountdownCircleTimer
                isPlaying={countDown}
                duration={5}
                size={200}
                strokeWidth={12}
                colors={"#60a5fa"}
                colorsTime={undefined}
                onComplete={() => ({ shouldRepeat: true, delay: 15 })}
              >
                {({ remainingTime }) => renderTime(remainingTime)}
              </CountdownCircleTimer>
            </div>
          ) : (
            <button
              type={"submit"}
              disabled={passwordChangeLoading || !passwordsMatch}
              className={`${
                passwordChangeLoading || !passwordsMatch
                  ? "bg-zinc-400"
                  : "bg-blue-400 dark:bg-blue-600 hover:bg-blue-500 dark:hover:bg-blue-700 active:scale-90"
              } flex justify-center rounded transition-all duration-300 ease-out my-6 px-4 py-2 text-white`}
            >
              Set
            </button>
          )}
        </div>
      </form>
      <div
        className={`${
          showRequestNewEmail ? "" : "opacity-0 select-none"
        } text-red-500 italic transition-opacity flex justify-center duration-300 ease-in-out`}
      >
        Token has expired, request a new one{" "}
        <Link
          className="underline underline-offset-4 pl-1 text-blue-500 hover:text-blue-400"
          href={"/login/request-password-reset"}
        >
          here
        </Link>
      </div>
    </div>
  );
}
