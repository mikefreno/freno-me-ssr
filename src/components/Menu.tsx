import React, { type RefObject } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import UserDefaultImage from "@/icons/UserDefaultImage";
import LoadingSpinner from "./LoadingSpinner";

export default function Menu(props: {
  menuRef: RefObject<HTMLDivElement>;
  setMenuOpen: (open: boolean) => void;
  menuShowing: boolean;
  user: {
    email?: string;
    image?: string;
    displayName?: string;
  } | null;
  status: number;
  signOutTrigger: (e: React.FormEvent) => Promise<void>;
  signOutLoading: boolean;
}) {
  const pathname = usePathname();

  return (
    <div
      id="menu"
      ref={props.menuRef}
      className={`${
        props.menuShowing ? "right-0" : "translate-x-[125%]"
      } fixed top-0 z-[100] shadow-left overflow-scroll ${
        pathname === "/app" ? "" : "md:hidden"
      }`}
    >
      <div
        className={`${
          pathname.split("/")[1] == "blog"
            ? "border-yellow-400 dark:border-yellow-700"
            : "border-blue-400 dark:border-blue-700"
        } border-l bg-zinc-50 min-w-[12rem] dark:bg-zinc-800 h-[100dvh]`}
      >
        <ul className="px-6 pb-4 pt-10">
          <li className="pt-2 text-lg">
            <Link href="/projects">
              <div
                className={`${
                  pathname == "/projects"
                    ? pathname.split("/")[1] == "blog"
                      ? "bg-yellow-400 dark:bg-yellow-700"
                      : "bg-blue-400 dark:bg-blue-700"
                    : pathname.split("/")[1] == "blog"
                    ? "hover:bg-yellow-400 hover:dark:bg-yellow-700"
                    : "hover:bg-blue-400 hover:dark:bg-blue-700"
                } rounded-lg p-2 px-4 text-center text-lg text-zinc-800  dark:text-zinc-100 `}
              >
                Projects
              </div>
            </Link>
          </li>
          <li className="pt-2 text-lg">
            <Link href="/blog">
              <div
                className={`${
                  pathname == "/blog"
                    ? pathname.split("/")[1] == "blog"
                      ? "bg-yellow-400 dark:bg-yellow-700"
                      : "bg-blue-400 dark:bg-blue-700"
                    : pathname.split("/")[1] == "blog"
                    ? "hover:bg-yellow-400 hover:dark:bg-yellow-700"
                    : "hover:bg-blue-400 hover:dark:bg-blue-700"
                } rounded-lg p-2 px-4 text-center text-lg text-zinc-800  dark:text-zinc-100 `}
              >
                Blog
              </div>
            </Link>
          </li>
          <li className="pt-2 text-lg">
            <Link href="/contact">
              <div
                className={`${
                  pathname == "/contact"
                    ? pathname.split("/")[1] == "blog"
                      ? "bg-yellow-400 dark:bg-yellow-700"
                      : "bg-blue-400 dark:bg-blue-700"
                    : pathname.split("/")[1] == "blog"
                    ? "hover:bg-yellow-400 hover:dark:bg-yellow-700"
                    : "hover:bg-blue-400 hover:dark:bg-blue-700"
                } rounded-lg p-2 px-4 text-center text-lg text-zinc-800  dark:text-zinc-100 `}
              >
                Contact
              </div>
            </Link>
          </li>

          {props.status == 202 ? (
            <>
              <li className="pt-2 text-lg">
                <Link href="/account">
                  <div
                    className={`${
                      pathname == "/account"
                        ? pathname.split("/")[1] == "blog"
                          ? "bg-yellow-400 dark:bg-yellow-700"
                          : "bg-blue-400 dark:bg-blue-700"
                        : pathname.split("/")[1] == "blog"
                        ? "hover:bg-yellow-400 hover:dark:bg-yellow-700"
                        : "hover:bg-blue-400 hover:dark:bg-blue-700"
                    } rounded-lg p-2 px-4 text-center flex text-lg text-zinc-800 dark:text-zinc-100 `}
                  >
                    {props.user?.image ? (
                      <Image
                        src={props.user.image}
                        height={28}
                        width={28}
                        alt="user-image"
                        className="-ml-2 h-9 w-9 rounded-full object-cover object-center"
                      />
                    ) : (
                      <div className="mr-1 rounded-full border border-black p-0.5 dark:border-white">
                        <UserDefaultImage
                          strokeWidth={1}
                          height={28}
                          width={28}
                        />
                      </div>
                    )}
                    <div className="my-auto pl-2">Account</div>
                  </div>
                </Link>
              </li>
              <li className="flex justify-center pt-2 text-lg">
                {props.signOutLoading ? (
                  <LoadingSpinner height={24} width={24} />
                ) : (
                  <button
                    onClick={props.signOutTrigger}
                    className={`${
                      pathname.split("/")[1] == "blog"
                        ? "hover:bg-yellow-400 hover:dark:bg-yellow-700"
                        : "hover:bg-blue-400 hover:dark:bg-blue-700"
                    } rounded-lg p-2 px-4 text-center text-lg text-zinc-800 dark:text-zinc-100`}
                  >
                    Sign out
                  </button>
                )}
              </li>
            </>
          ) : (
            <li className="pt-2 text-lg">
              <Link href="/login">
                <div
                  className={`${
                    pathname == "/login"
                      ? pathname.split("/")[1] == "blog"
                        ? "bg-yellow-400 dark:bg-yellow-700"
                        : "bg-blue-400 dark:bg-blue-700"
                      : pathname.split("/")[1] == "blog"
                      ? "hover:bg-yellow-400 hover:dark:bg-yellow-700"
                      : "hover:bg-blue-400 hover:dark:bg-blue-700"
                  } rounded-lg p-2 px-4 text-center text-lg text-zinc-800  dark:text-zinc-100 `}
                >
                  Login /<br /> Register
                </div>
              </Link>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
