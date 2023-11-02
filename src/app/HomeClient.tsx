"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import useOnClickOutside from "@/hooks/ClickOutsideHook";
import AboutMeModal from "./AboutMeModal";
import ContactModal from "./ContactModal";

export default function HomeClient(props: {
  user: {
    email?: string | undefined;
    display_name?: string | undefined;
    image?: string | undefined;
  } | null;
}) {
  //refs
  const centerDiv = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);
  const professionRef = useRef<HTMLDivElement>(null);
  const topHR = useRef<HTMLHRElement>(null);
  const bottomHR = useRef<HTMLHRElement>(null);
  const linkRef = useRef<HTMLDivElement>(null);

  const contactRef = useRef<HTMLDivElement>(null);
  const contactButtonRef = useRef<HTMLButtonElement>(null);

  const aboutRef = useRef<HTMLDivElement>(null);
  const aboutButtonRef = useRef<HTMLButtonElement>(null);
  //state
  const [onLoad, setOnLoad] = useState<boolean>(false);
  const [windowWidth, setWindowWidth] = useState(0);
  const [showingAbout, setShowingAbout] = useState(false);
  const [showingContact, setShowingContact] = useState(false);

  useOnClickOutside([aboutButtonRef, aboutRef], () => {
    setShowingAbout(false);
  });
  useOnClickOutside([contactButtonRef, contactRef], () => {
    setShowingContact(false);
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      setWindowWidth(window.innerWidth);

      const handleResize = () => {
        setWindowWidth(window.innerWidth);
      };

      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }
  }, []);

  useEffect(() => {
    setTimeout(() => setOnLoad(true), 200);
    setTimeout(() => {
      centerDiv.current?.classList.replace("max-h-0", "max-h-[300px]");
      nameRef.current?.classList.replace("max-h-0", "max-h-[200px]");
      professionRef.current?.classList.replace("max-h-0", "max-h-[200px]");
    }, 300);
  }, []);

  useEffect(() => {
    if (linkRef.current && bottomHR.current) {
      bottomHR.current.style.width = `${linkRef.current.offsetWidth}px`;
    }
    if (linkRef.current && topHR.current) {
      topHR.current.style.width = `${linkRef.current.offsetWidth}px`;
    }
  }, [windowWidth, showingAbout, showingContact]);

  const aboutToggle = () => {
    setShowingAbout(!showingAbout);
  };

  const contactToggle = () => {
    setShowingContact(!showingContact);
  };

  if (windowWidth == 0) {
    return (
      <>
        <link rel="preload" as="image" href="/blur_SH_water.jpg" />
        <link rel="preload" as="image" href="/me_in_flannel.jpg" />
        <div className="page-fade-in h-full w-full bg-black"></div>
      </>
    );
  } else {
    return (
      <>
        <link rel="preload" as="image" href="/blur_SH_water.jpg" />
        <link rel="preload" as="image" href="/me_in_flannel.jpg" />
        <div className="page-fade-in max-h-[100dvh] bg-[url('/blur_SH_water.jpg')] bg-cover bg-center bg-no-repeat text-white">
          <div className="flex min-h-[100dvh] w-screen justify-center backdrop-brightness-50">
            <div
              className={`${
                showingAbout || showingContact ? "hidden" : "fade-in"
              } flex min-h-[100dvh] w-full flex-col justify-center opacity-0`}
            >
              <div className="text-center">
                <div
                  ref={topHR}
                  style={{
                    width: onLoad ? `${linkRef.current?.offsetWidth}px` : 0,
                  }}
                  className={`mx-auto transform border-[0.5px] border-white transition-all duration-[1500ms]`}
                />
                <div
                  ref={centerDiv}
                  className="max-h-0 transform overflow-hidden bg-transparent transition-all duration-[1500ms] ease-out"
                >
                  <div className="py-12">
                    <div
                      ref={nameRef}
                      className="max-h-0 transform overflow-hidden transition-all duration-1000 ease-out"
                    >
                      <h1 className="pb-6 text-4xl font-light tracking-widest">
                        Mike Freno
                      </h1>
                    </div>
                    <div
                      ref={professionRef}
                      className="max-h-0 transform overflow-hidden transition-all duration-1000 ease-out"
                    >
                      <p className="text-xl font-light tracking-wide">
                        A Programmer.
                      </p>
                    </div>
                  </div>
                </div>
                <div
                  ref={bottomHR}
                  style={{
                    width: onLoad ? `${linkRef.current?.offsetWidth}px` : 0,
                  }}
                  className={`mx-auto transform border-[0.5px] border-white transition-all duration-[1500ms]`}
                />
              </div>
              <div className="flex justify-center">
                <div
                  className={`${
                    onLoad ? "h-16" : "h-0"
                  } -mb-[21px] -mt-[1px] w-0 transform border-[0.5px] border-white transition-all duration-[1500ms]`}
                />
              </div>
              <nav className="mx-auto flex flex-row">
                {windowWidth == 0 || windowWidth > 768 ? (
                  <div
                    ref={linkRef}
                    className="duration-400 flex w-fit flex-row transition-all ease-in-out"
                  >
                    <button
                      ref={aboutButtonRef}
                      onClick={aboutToggle}
                      className="w-20 rounded border border-white py-2 text-center hover:bg-white hover:bg-opacity-20 active:bg-opacity-60 sm:w-24 md:w-28"
                    >
                      About
                    </button>
                    <div className="mx-auto my-auto h-0 w-4 border-[0.5px] border-white md:w-8" />

                    <Link
                      href="/projects"
                      className="w-20 rounded border border-white py-2 text-center text-white hover:bg-white hover:bg-opacity-20 active:bg-opacity-60 sm:w-24 md:w-28"
                    >
                      Projects
                    </Link>

                    <div className="mx-auto my-auto h-0 w-4 border-[0.5px] border-white md:w-8" />

                    <Link
                      href="/blog"
                      className="w-20 rounded border border-white py-2 text-center text-white hover:bg-white hover:bg-opacity-20 active:bg-opacity-60 sm:w-24 md:w-28"
                    >
                      Blog
                    </Link>

                    <div className="mx-auto my-auto h-0 w-4 border-[0.5px] border-white md:w-8" />

                    <button
                      ref={contactButtonRef}
                      onClick={contactToggle}
                      className="w-20 rounded border border-white py-2 text-center hover:bg-white hover:bg-opacity-20 active:bg-opacity-60 sm:w-24 md:w-28"
                    >
                      Contact
                    </button>
                  </div>
                ) : (
                  <div ref={linkRef} className="mt-5 flex flex-col">
                    <button
                      ref={aboutButtonRef}
                      onClick={aboutToggle}
                      className="w-36 rounded border border-white py-4 text-center hover:bg-white hover:bg-opacity-20 active:bg-opacity-60"
                    >
                      About
                    </button>
                    <div className="mx-auto">
                      <div
                        className={`${
                          onLoad ? "h-4" : "h-0"
                        } border-[0.5px] w-0 border-white transform transition-all duration-[1500ms] ease-in-out`}
                      />
                    </div>
                    <Link
                      href="/projects"
                      className="w-36 rounded border border-white py-4 text-center text-white hover:bg-white hover:bg-opacity-20 active:bg-opacity-60"
                    >
                      Projects
                    </Link>
                    <div className="mx-auto">
                      <div
                        className={`${
                          onLoad ? "h-4" : "h-0"
                        } border-[0.5px] w-0 border-white transform transition-all duration-[1500ms] ease-in-out`}
                      />
                    </div>
                    <Link
                      href="/blog"
                      className="w-36 rounded border border-white py-4 text-center text-white hover:bg-white hover:bg-opacity-20 active:bg-opacity-60"
                    >
                      Blog
                    </Link>
                    <div className="mx-auto">
                      <div
                        className={`${
                          onLoad ? "h-4" : "h-0"
                        } border-[0.5px] w-0 border-white transform transition-all duration-[1500ms] ease-in-out`}
                      />
                    </div>
                    <button
                      ref={contactButtonRef}
                      onClick={contactToggle}
                      className="w-36 rounded border border-white py-4 text-center hover:bg-white hover:bg-opacity-20 active:bg-opacity-60"
                    >
                      Contact
                    </button>
                  </div>
                )}
              </nav>
            </div>
          </div>
          <div className="-mt-[100dvh]">
            <AboutMeModal
              showing={showingAbout}
              aboutRef={aboutRef}
              aboutToggle={aboutToggle}
            />
            <div className="-mt-[100dvh]">
              <ContactModal
                showing={showingContact}
                contactRef={contactRef}
                contactToggle={contactToggle}
                user={props.user}
              />
            </div>
          </div>
        </div>
      </>
    );
  }
}
