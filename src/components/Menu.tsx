import React, { type RefObject } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { API_RES_GetUserDataFromCookie } from "@/types/response-types";
import UserDefaultImage from "@/icons/UserDefaultImage";

export default function Menu(props: {
  menuRef: RefObject<HTMLDivElement>;
  setMenuOpen: (open: boolean) => void;
  userData:
    | {
        data: API_RES_GetUserDataFromCookie;
        status: number;
      }
    | undefined;
}) {
  const pathname = usePathname();
  const signOut = () => {};
  return (
    <div
      id="menu"
      ref={props.menuRef}
      className={`fade-in absolute right-0 top-0 shadow-lg z-[100] overflow-scroll ${
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
        <ul className="px-6 pt-8 pb-4">
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

          {props.userData?.status == 202 ? (
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
                    {props.userData?.data.image ? (
                      <Image
                        src={props.userData?.data.image}
                        height={28}
                        width={28}
                        alt="user-image"
                        className="rounded-full w-9 -ml-2 h-9 object-cover object-center"
                      />
                    ) : (
                      <div className="border border-black dark:border-white rounded-full p-0.5 mr-1">
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
              <li className="pt-2 text-lg flex justify-center">
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
                  Login / Register
                </div>
              </Link>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
