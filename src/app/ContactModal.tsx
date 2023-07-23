import Xmark from "@/icons/Xmark";
import { RefObject } from "react";
import { sendContactRequest } from "./globalActions";
import Link from "next/link";
import GitHub from "@/icons/GitHub";
import LinkedIn from "@/icons/LinkedIn";

export default function ContactModal(props: ContactModalProps) {
  return (
    <>
      <div
        className={`${
          props.showing
            ? "fade-in flex"
            : "backdrop-brightness-100 backdrop-blur-0 -translate-x-full absolute"
        } w-full h-screen justify-center overflow-scroll pb-36 pt-24 md:pb-[20vh] md:pt-[15vh] opacity-0 backdrop-blur-sm backdrop-brightness-75`}
      >
        <div
          ref={props.contactRef}
          className={`${
            props.showing ? "" : "-translate-y-full"
          } h-fit w-11/12 rounded border border-white bg-white bg-opacity-10 px-4 py-2 md:w-3/4 lg:w-3/5 md:px-12 md:py-6 xl:w-1/2 transition-all duration-700 ease-in-out`}
        >
          <div className="-my-6 flex justify-end pt-4 md:pt-2">
            <button onClick={props.contactToggle}>
              <Xmark strokeWidth={0.5} color={"white"} height={50} width={50} />
            </button>
          </div>
          <h2 className="text-3xl font-light tracking-wide underline underline-offset-4">
            Contact Me
          </h2>
          <form action={sendContactRequest}>
            <div className="mt-24">
              <div className="flex flex-col md:flex-row justify-evenly">
                <div className="input-group home mx-auto">
                  <input
                    type="text"
                    required
                    name="name"
                    placeholder=" "
                    className="bg-transparent underlinedInput w-full"
                  />
                  <span className="bar"></span>
                  <label className="underlinedInputLabel">Name</label>
                </div>
                <div className="input-group home mx-auto">
                  <input
                    type="email"
                    required
                    name="email"
                    placeholder=" "
                    className="bg-transparent underlinedInput w-full"
                  />
                  <span className="bar"></span>
                  <label className="underlinedInputLabel">Email</label>
                </div>
              </div>
              <div className="pl-7 pt-12">
                <div className="textarea-group home">
                  <textarea
                    required
                    name="message"
                    placeholder=" "
                    className="bg-transparent underlinedInput w-full"
                    rows={4}
                  />
                  <span className="bar" />
                  <label className="underlinedInputLabel">
                    Your Question, Concern, Comment
                  </label>
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="rounded border text-white shadow-md border-white bg-transparent hover:border-blue-400 hover:bg-blue-400 active:scale-90 transition-all duration-300 ease-in-out px-4 py-2"
                >
                  Send Message
                </button>
              </div>
            </div>
          </form>
          <ul className="icons flex justify-center py-4">
            <li>
              <Link
                href="https://github.com/MikeFreno/"
                target="_blank"
                rel="noreferrer"
                className="hvr-grow-rotate-left shaker rounded-full border-zinc-800 dark:border-zinc-300"
              >
                <span className="m-auto">
                  <GitHub height={20} width={20} fill={"white"} />
                </span>
              </Link>
            </li>
            <li>
              <Link
                href="https://www.linkedin.com/in/michael-freno-176001256/"
                target="_blank"
                rel="noreferrer"
                className="hvr-grow-rotate rounded-full shaker border-zinc-800 dark:border-zinc-300"
              >
                <span className="m-auto">
                  <LinkedIn height={20} width={20} fill={"white"} />
                </span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}

interface ContactModalProps {
  showing: boolean;
  contactRef: RefObject<HTMLDivElement>;
  contactToggle: () => void;
}
