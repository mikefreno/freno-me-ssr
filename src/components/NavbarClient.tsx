/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import MenuBars from "@/icons/MenuBars";
import Menu from "./Menu";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import useOnClickOutside from "@/hooks/ClickOutsideHook";
import UserDefaultImage from "@/icons/UserDefaultImage";
import { signOut } from "@/app/globalActions";
import LoadingSpinner from "./LoadingSpinner";

export default function NavbarClient(props: {
  user: {
    email?: string;
    image?: string;
    displayName?: string;
  } | null;
  status: number;
}) {
  const [signOutLoading, setSignOutLoading] = useState<boolean>(false);
  const router = useRouter();
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

  useEffect(() => {
    setSignOutLoading(false);
  }, [props.user]);

  const signOutTrigger = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignOutLoading(true);
    try {
      await signOut();
      setTimeout(() => router.refresh(), 500);
    } catch (e) {
      console.log("error here: " + e);
    }
  };

  return (
    <nav className="fixed z-50 flex w-screen bg-white bg-opacity-50 p-2 backdrop-blur dark:bg-opacity-5">
      <div className={`mx-4 my-2 flex flex-1`}>
        <Link href={"/"} className="z-50 flex">
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
        <ul className="hidden pr-2 text-sm text-zinc-900 dark:text-zinc-200 md:flex">
          <li className="my-auto pl-4">
            <Link
              href="/projects"
              shallow={false}
              className={`
                  ${
                    pathname.match("/projects")
                      ? "under underline"
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
                  ? "under underline"
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
                  ? "under underline"
                  : "hover-underline-animation"
              } border-zinc-900 text-zinc-900 underline-offset-4 dark:border-zinc-200 dark:text-zinc-200`}
            >
              Contact
            </Link>
          </li>
          {props.status == 202 ? (
            <>
              <li className="pl-4">
                <Link href="/account">
                  <div className="flex">
                    {props.user?.image ? (
                      <Image
                        src={props.user.image}
                        height={36}
                        width={36}
                        alt="user-image"
                        className="h-9 w-9 rounded-full object-cover object-center"
                      />
                    ) : (
                      <div className="mr-1 rounded-full border border-black p-0.5 dark:border-white">
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
                {signOutLoading ? (
                  <LoadingSpinner height={24} width={24} />
                ) : (
                  <button
                    onClick={signOutTrigger}
                    className="hover-underline-animation cursor-pointer border-zinc-900 text-zinc-900 underline-offset-4 dark:border-zinc-200 dark:text-zinc-200"
                    type="submit"
                  >
                    Sign out
                  </button>
                )}
              </li>
            </>
          ) : (
            <li className="my-auto pl-4">
              <Link
                href="/login"
                className={`${
                  pathname == "login"
                    ? "under underline"
                    : "hover-underline-animation"
                } border-zinc-900 text-zinc-900 underline-offset-4 dark:border-zinc-200 dark:text-zinc-200`}
              >
                Login / Register
              </Link>
            </li>
          )}
        </ul>
        <div
          className={`${
            menuOpen ? "-mr-2 -mt-4" : ""
          } my-auto transition-all duration-300 ease-in md:hidden`}
        >
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
              user={props.user}
              status={props.status}
              signOutTrigger={signOutTrigger}
              signOutLoading={signOutLoading}
            />
          ) : null}
        </div>
      </div>
    </nav>
  );
}
