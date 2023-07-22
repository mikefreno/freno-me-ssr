/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import MenuBars from "@/icons/MenuBars";
import Menu from "./Menu";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import useOnClickOutside from "@/hooks/ClickOutsideHook";
import useSWR from "swr";
import Cookies from "js-cookie";
import UserDefaultImage from "@/icons/UserDefaultImage";
import { signOut } from "@/app/globalActions";
import { API_RES_GetUserDataFromCookie } from "@/types/response-types";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  const data = (await res.json()) as API_RES_GetUserDataFromCookie;

  return { data, status: res.status };
};

export default function Navbar() {
  const { data: userData, error: reactionError } = useSWR(
    `/api/user-data/cookie/${Cookies.get("userIDToken")}`,
    fetcher
  );

  const router = useRouter();
  const pathname = usePathname();
  //state
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [user, setUser] = useState<{
    id: string;
    email: string | undefined;
    emailVerified: boolean;
    image: string | null;
    displayName: string | undefined;
    provider: string | undefined;
  } | null>(null);
  //ref
  const menuRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useOnClickOutside([menuRef, closeRef], () => {
    setMenuOpen(false);
  });

  useEffect(() => {
    rotateBars();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menuOpen]);

  function rotateBars() {
    if (menuOpen) {
      document.getElementById("LineA")?.classList.add("LineA");
      document.getElementById("LineB")?.classList.add("LineB");
    } else {
      document.getElementById("LineA")?.classList.remove("LineA");
      document.getElementById("LineB")?.classList.remove("LineB");
    }
  }

  useEffect(() => {
    if (userData) {
      setUser(userData.data);
    }
  }, [userData]);

  function menuToggle() {
    setMenuOpen(!menuOpen);
    rotateBars();
  }

  const signOutTrigger = async (e: React.FormEvent) => {
    e.preventDefault();
    await signOut();
    Cookies.remove("userIDToken");
    Cookies.remove("emailToken");
    router.refresh();
  };

  return (
    <div className={pathname == "/" ? "hidden" : undefined}>
      <nav className="fixed z-50 flex w-screen bg-white bg-opacity-50 p-2 backdrop-blur dark:bg-opacity-5">
        <div className={`mx-4 my-2 flex flex-1`}>
          <Link href={"/"} className="flex z-50">
            <picture className="logoSpinner">
              <source
                srcSet="/WhiteLogo.png"
                media="(prefers-color-scheme: dark)"
              />
              <img src="/BlackLogo.png" alt="logo" width={40} height={40} />
            </picture>
          </Link>
        </div>
        <div className="my-auto flex justify-end" style={{ flex: 3 }}>
          <ul className="hidden text-sm text-zinc-900 dark:text-zinc-200 pr-2 md:flex">
            <li className="my-auto pl-4">
              <Link
                href="/projects"
                shallow={false}
                className={`
                  ${
                    pathname.match("/projects")
                      ? "underline under"
                      : "hover-underline-animation"
                  } border-zinc-900 text-zinc-900 underline-offset-4  dark:border-zinc-200 dark:text-zinc-200`}
              >
                Projects
              </Link>
            </li>
            <li className="my-auto pl-4">
              <Link
                href="/blog"
                shallow={false}
                className={`${
                  pathname.match("/blog")
                    ? "underline under"
                    : "hover-underline-animation"
                } border-zinc-900 text-zinc-900 underline-offset-4 dark:border-zinc-200 dark:text-zinc-200`}
              >
                Blog
              </Link>
            </li>

            <li className="my-auto pl-4">
              <Link
                href="/contact"
                className={`${
                  pathname.match("/contact")
                    ? "underline under"
                    : "hover-underline-animation"
                } border-zinc-900 text-zinc-900 underline-offset-4 dark:border-zinc-200 dark:text-zinc-200`}
              >
                Contact
              </Link>
            </li>
            {userData?.status == 202 ? (
              <>
                <li className="pl-4">
                  <Link href="/account">
                    <div className="flex">
                      {user?.image ? (
                        <Image
                          src={user.image}
                          height={36}
                          width={36}
                          alt="user-image"
                          className="rounded-full w-9 h-9 object-cover object-center"
                        />
                      ) : (
                        <div className="border border-black dark:border-white rounded-full p-0.5 mr-1">
                          <UserDefaultImage
                            strokeWidth={1}
                            height={36}
                            width={36}
                          />
                        </div>
                      )}
                      <div
                        className={`${
                          pathname == "/account"
                            ? "underline"
                            : "hover-underline-animation"
                        } my-auto pl-[6px] border-zinc-900 text-zinc-900 underline-offset-4 dark:border-zinc-200 dark:text-zinc-200`}
                      >
                        Account
                      </div>
                    </div>
                  </Link>
                </li>
                <li className="my-auto pl-4">
                  <form onSubmit={signOutTrigger}>
                    <button
                      className="hover-underline-animation cursor-pointer border-zinc-900 text-zinc-900 underline-offset-4 dark:border-zinc-200 dark:text-zinc-200"
                      type="submit"
                    >
                      Sign out
                    </button>
                  </form>
                </li>
              </>
            ) : (
              <li className="my-auto pl-4">
                <Link
                  href="/login"
                  className={`${
                    pathname == "login"
                      ? "underline under"
                      : "hover-underline-animation"
                  } border-zinc-900 text-zinc-900 underline-offset-4 dark:border-zinc-200 dark:text-zinc-200`}
                >
                  Login / Register
                </Link>
              </li>
            )}
          </ul>
          <div className="my-auto pl-4 pr-2 md:hidden">
            <button
              onClick={menuToggle}
              className="z-[1000] my-auto"
              ref={closeRef}
            >
              <MenuBars />
            </button>
          </div>
          <div className="">
            {menuOpen ? (
              <Menu
                menuRef={menuRef}
                setMenuOpen={setMenuOpen}
                userDataResponse={userData?.status}
              />
            ) : null}
          </div>
        </div>
      </nav>
    </div>
  );
}
