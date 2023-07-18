import React, { use } from "react";
import Link from "next/link";
import GoogleLogo from "@/icons/GoogleLogo";
import GitHub from "@/icons/GitHub";
import {
  emailLinkLogin,
  emailPasswordLogin,
  emailRegistration,
} from "./actions";
import Navbar from "@/components/Navbar";
import { env } from "@/env.mjs";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const { register, error, usePassword, loading } = searchParams;

  const formHandler = (e: React.FormEvent) => {
    e.preventDefault();
  };

  async function emailLogin() {}
  async function googleLogin() {}
  async function githubLogin() {}

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
        <div className="pt-48">
          <div className="py-2 text-2xl">
            {register == "true" ? "Register" : "Login"}
          </div>
          {register !== "true" ? (
            <div className="text-center py-4">
              Don&apos;t have an account yet?
              <Link
                className="pl-1 text-blue-400 dark:text-blue-600 underline"
                href={"/login?register=true"}
              >
                Click here to Register
              </Link>
            </div>
          ) : (
            <div className="text-center py-4">
              Already have an account?
              <Link
                className="pl-1 text-blue-400 dark:text-blue-600 underline"
                href={"/login"}
              >
                Click here to Login
              </Link>
            </div>
          )}
          <form
            action={
              register == "true"
                ? emailRegistration
                : usePassword == "true"
                ? emailPasswordLogin
                : emailLinkLogin
            }
            className="flex flex-col px-2 py-4"
          >
            <div className="flex justify-center">
              <div className="input-group mx-4">
                <input
                  type="text"
                  required
                  name="email"
                  placeholder=" "
                  className="bg-transparent underlinedInput"
                />
                <span className="bar"></span>
                <label className="underlinedInputLabel">Email</label>
              </div>
            </div>
            {usePassword == "true" || register == "true" ? (
              <div className="-mt-4 flex justify-center">
                <div className="input-group mx-4">
                  <input
                    type="password"
                    required
                    name="password"
                    placeholder=" "
                    className="bg-transparent underlinedInput"
                  />
                  <span className="bar"></span>
                  <label className="underlinedInputLabel">Password</label>
                </div>
              </div>
            ) : null}
            {register == "true" ? (
              <div className="-mt-4 flex justify-center">
                <div className="input-group mx-4">
                  <input
                    type="password"
                    required
                    name="passwordConfirmation"
                    placeholder=" "
                    className="bg-transparent underlinedInput"
                  />
                  <span className="bar"></span>
                  <label className="underlinedInputLabel">
                    Password Confirmation
                  </label>
                </div>
              </div>
            ) : null}
            <div className="flex pt-4 mx-auto">
              <input type="checkbox" className="my-auto" name="rememberMe" />
              <div className="my-auto px-2 text-sm font-normal">
                Remember Me
              </div>
            </div>
            <div className="flex justify-center py-4">
              <button
                type={"submit"}
                className={`${
                  loading
                    ? "bg-zinc-400"
                    : "bg-blue-400 dark:bg-blue-600 hover:bg-blue-500 dark:hover:bg-blue-700 active:scale-90"
                } flex w-36 justify-center rounded transition-all duration-300 ease-out py-3 text-white`}
              >
                {register == "true"
                  ? "Sign Up"
                  : usePassword == "true"
                  ? "Sign In"
                  : "Get Link"}
              </button>
              {register != "true" && usePassword !== "true" ? (
                <Link
                  href={"/login?usePassword=true"}
                  className="px-2 text-sm hover-underline-animation my-auto"
                >
                  Use Password
                </Link>
              ) : usePassword == "true" ? (
                <Link
                  href={"/login"}
                  className="px-2 text-sm hover-underline-animation my-auto"
                >
                  Use Email Link
                </Link>
              ) : null}
            </div>
          </form>
          <div className="rule-around text-center">Or</div>
          <div className="my-2 flex justify-center">
            <div className="mx-auto mb-4 flex flex-col">
              <button className="my-4 flex w-80 flex-row bg-white hover:bg-zinc-100 justify-between dark:border-zinc-50 dark:border rounded text-black border dark:text-white border-zinc-800 dark:bg-zinc-800 px-4 py-2 dark:hover:bg-zinc-700 active:scale-95 transition-all duration-300 ease-out">
                {register != "true" ? "Sign in " : "Register "} with Google
                <span className="my-auto">
                  <GoogleLogo height={24} width={24} />
                </span>
              </button>
              <div className="px-4"></div>
              <Link
                href={`https://github.com/login/oauth/authorize?client_id=${env.NEXT_PUBLIC_GITHUB_CLIENT_ID}&redirect_uri=${env.NEXT_PUBLIC_DOMAIN}/api/auth/github&scope=user`}
                className="my-4 flex w-80 flex-row justify-between rounded bg-zinc-600 px-4 py-2 text-white hover:bg-zinc-700 active:scale-95 transition-all duration-300 ease-out"
              >
                {register != "true" ? "Sign in " : "Register "} with Github
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
