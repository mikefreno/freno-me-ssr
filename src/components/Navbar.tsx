"use client";

import React, { useContext, useEffect, useRef, useState } from "react";
import Image from "next/image";
import MenuBars from "@/icons/MenuBars";
import Menu from "./Menu";
import Link from "next/link";
import { usePathname } from "next/navigation";
import useOnClickOutside from "@/hooks/ClickOutsideHook";
import useSWR from "swr";
import Cookies from "js-cookie";
import UserDefaultImage from "@/icons/UserDefaultImage";
import { signOut } from "@/app/globalActions";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  const data = await res.json();

  return { data, status: res.status };
};

export default function Navbar() {
  const { data: userData, error: reactionError } = useSWR(
    `/api/user-data/cookie/${Cookies.get("userIDToken")}`,
    fetcher
  );

  const pathname = usePathname();
  //state
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
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

  function menuToggle() {
    setMenuOpen(!menuOpen);
    rotateBars();
  }

  return (
    <div className={pathname == "/" ? "hidden" : undefined}>
      <nav className="fixed z-50 flex w-screen bg-white bg-opacity-30 p-2 backdrop-blur dark:bg-opacity-5">
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
          <ul className="hidden text-sm text-[#171717] dark:text-[#222222] md:flex">
            <li className="my-auto pl-4">
              <Link
                href="/projects"
                shallow={false}
                className={`
                  ${
                    pathname.match("/projects")
                      ? "underline under"
                      : "hover-underline-animation"
                  } border-[#171717] text-[#171717] underline-offset-4  dark:border-[#E2E2E2] dark:text-[#E2E2E2]`}
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
                } border-[#171717] text-[#171717] underline-offset-4 dark:border-[#E2E2E2] dark:text-[#E2E2E2]`}
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
                } border-[#171717] text-[#171717] underline-offset-4 dark:border-[#E2E2E2] dark:text-[#E2E2E2]`}
              >
                Contact
              </Link>
            </li>
            {userData?.status == 202 ? (
              <>
                <li className="pl-4">
                  <Link href="/account">
                    <div className="flex">
                      {userData.data.image ? (
                        <Image
                          src={userData.data.image}
                          height={20}
                          width={20}
                          alt="user-image"
                          className="rounded-full"
                        />
                      ) : (
                        <div className="border border-black dark:border-white rounded-full p-0.5 mr-1">
                          <UserDefaultImage
                            strokeWidth={1}
                            height={20}
                            width={20}
                          />
                        </div>
                      )}
                      <div
                        className={`${
                          pathname == "/account"
                            ? "underline"
                            : "hover-underline-animation"
                        } my-auto border-[#171717]text-[#171717] underline-offset-4 dark:border-[#E2E2E2] dark:text-[#E2E2E2]`}
                      >
                        Account
                      </div>
                    </div>
                  </Link>
                </li>
                <li className="my-auto pl-4">
                  <form action={signOut}>
                    <button
                      className="hover-underline-animation cursor-pointer border-[#171717] text-[#171717] underline-offset-4 dark:border-[#E2E2E2] dark:text-[#E2E2E2]"
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
                  } border-[#171717] text-[#171717] underline-offset-4 dark:border-[#E2E2E2] dark:text-[#E2E2E2]`}
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
              <MenuBars stroke="black" />
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
