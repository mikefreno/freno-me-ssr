import Navbar from "@/components/Navbar-client";
import Head from "next/head";
import { sendContactRequest } from "../globalActions";
import Link from "next/link";
import GitHub from "@/icons/GitHub";
import LinkedIn from "@/icons/LinkedIn";

export default function Contact() {
  return (
    <>
      <div className="flex min-h-screen justify-center w-full">
        <div className="pt-[20vh]">
          <div className="text-center text-3xl tracking-widest dark:text-white">
            Contact
          </div>
          <form action={sendContactRequest} className="min-w-[85vw]">
            <div className="pt-6 md:mt-24 flex flex-col justify-evenly w-full">
              <div className="md:flex md:flex-row justify-evenly mx-auto w-full md:w-3/4 lg:w-1/2">
                <div className="input-group md:mx-4">
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
                <div className="input-group md:mx-4">
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
              <div className="pt-6 md:pt-12 mx-auto w-full md:w-3/4 lg:w-1/2">
                <div className="textarea-group">
                  <textarea
                    required
                    name="message"
                    placeholder=" "
                    className="bg-transparent underlinedInput w-full"
                    rows={4}
                  />
                  <span className="bar" />
                  <label className="underlinedInputLabel">Message</label>
                </div>
              </div>
              <div className="flex justify-end pt-4 w-full md:w-3/4 mx-auto lg:w-1/2">
                <button
                  type="submit"
                  className="rounded border text-white shadow-md border-blue-500 bg-blue-400 hover:bg-blue-500 dark: dark:bg-blue-700 dark:hover:bg-blue-800 dark:border-blue-700 active:scale-90 transition-all duration-300 ease-in-out px-4 py-2"
                >
                  Send Message
                </button>
              </div>
            </div>
          </form>
          <ul className="icons flex justify-center pt-24 pb-6">
            <li>
              <Link
                href="https://github.com/MikeFreno/"
                target="_blank"
                rel="noreferrer"
                className="hvr-grow-rotate-left rounded-full border-zinc-800 dark:border-zinc-300"
              >
                <span className="m-auto p-2">
                  <GitHub height={24} width={24} fill={undefined} />
                </span>
              </Link>
            </li>
            <li>
              <Link
                href="https://www.linkedin.com/in/michael-freno-176001256/"
                target="_blank"
                rel="noreferrer"
                className="hvr-grow-rotate rounded-full border-zinc-800 dark:border-zinc-300"
              >
                <span className="m-auto p-2 rounded-md">
                  <LinkedIn height={24} width={24} fill={undefined} />
                </span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
