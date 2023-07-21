import React, { type RefObject } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import BackArrow from "../icons/BackArrow";
import Image from "next/image";

export default function Menu(props: {
  menuRef: RefObject<HTMLDivElement>;
  setMenuOpen: (open: boolean) => void;
  userDataResponse: number | undefined;
}) {
  const pathname = usePathname();
  const signOut = () => {};
  return (
    <div
      id="menu"
      ref={props.menuRef}
      className={`fade-in absolute right-2 top-2 z-[100] overflow-scroll ${
        pathname === "/app" ? "" : "md:hidden"
      }`}
    >
      <div
        className={`${
          pathname.split("/")[1] == "blog"
            ? "border-yellow-400 dark:border-yellow-700"
            : "border-blue-400 dark:border-blue-700"
        } rounded-b-3xl rounded-tl-3xl rounded-tr-sm border bg-zinc-50 shadow-xl dark:bg-zinc-900`}
      >
        <ul className="px-1 pb-4 pt-8 w-2/3 mx-auto">
          <li className="pt-2 text-lg">
            <Link href="/">
              <div
                className={`${
                  pathname.split("/")[1] == "blog"
                    ? "hover:bg-yellow-400 hover:dark:bg-yellow-700"
                    : "hover:bg-blue-400 hover:dark:bg-blue-700"
                } rounded-lg p-2 px-4 text-center text-lg text-zinc-800 dark:text-zinc-100`}
              >
                Home
              </div>
            </Link>
          </li>
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
          {status == "authenticated" ? (
            <li className="pt-2 text-lg">
              <Link href={"/account"}>
                <div
                  className={`${
                    pathname == "/account"
                      ? pathname.split("/")[1] == "blog"
                        ? "bg-yellow-400 dark:bg-yellow-700"
                        : "bg-blue-400 dark:bg-blue-700"
                      : pathname.split("/")[1] == "blog"
                      ? "hover:bg-yellow-400 hover:dark:bg-yellow-700"
                      : "hover:bg-blue-400 hover:dark:bg-blue-700"
                  } rounded-lg p-2 px-4 text-center text-lg text-zinc-800  dark:text-zinc-100 `}
                >
                  Account
                </div>
              </Link>
            </li>
          ) : null}

          {props.userDataResponse == 202 ? (
            <li className="pt-2 text-lg">
              <button
                onClick={signOut}
                className={`${
                  pathname.split("/")[1] == "blog"
                    ? "hover:bg-yellow-400 hover:dark:bg-yellow-700"
                    : "hover:bg-blue-400 hover:dark:bg-blue-700"
                } rounded-lg p-2 px-4 text-center text-lg text-zinc-800 dark:text-zinc-100`}
              >
                Sign out
              </button>
            </li>
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
                  Login / Register
                </div>
              </Link>
            </li>
          )}
          {/* 
          //   <div className="my-auto flex justify-center pr-2">
          //     <Loading size="lg" color={"secondary"} />
          //     <div className="absolute mt-1">
          //       <Image
          //         src={"/favicon.ico"}
          //         alt={"logo"}
          //         width="36"
          //         height="36"
          //       />
          //     </div>
          //   </div>
          //  */}
        </ul>
      </div>
    </div>
  );
}
