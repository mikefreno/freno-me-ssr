import Navbar from "@/components/Navbar";
import Head from "next/head";
import { sendContactRequest } from "../globalActions";
import Link from "next/link";
import GitHub from "@/icons/GitHub";
import LinkedIn from "@/icons/LinkedIn";

export default function Contact() {
  return (
    <>
      <div className="flex min-h-screen justify-center px-12">
        <div className="pt-[20vh]">
          <div className="text-center text-3xl tracking-widest dark:text-white">
            Contact
          </div>
          <form action={sendContactRequest}>
            <div className="mt-24">
              <div className="flex justify-evenly md:mx-24">
                <div className="input-group mx-4">
                  <input
                    type="text"
                    required
                    name="name"
                    placeholder=" "
                    className="bg-transparent underlinedInput"
                  />
                  <span className="bar"></span>
                  <label className="underlinedInputLabel">Name</label>
                </div>
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
              <div className="pl-7 pt-12 max-w-[40vw] mx-auto">
                <div className="textarea-group">
                  <textarea
                    required
                    name="message"
                    placeholder=" "
                    className="bg-transparent underlinedInput w-full "
                    rows={4}
                  />
                  <span className="bar" />
                  <label className="underlinedInputLabel">Message</label>
                </div>
              </div>
              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  className="rounded border text-white shadow-md border-blue-500 bg-blue-400 hover:bg-blue-500 dark: dark:bg-blue-700 dark:hover:bg-blue-800 dark:border-blue-700 active:scale-90 transition-all duration-300 ease-in-out px-4 py-2"
                >
                  Send Message
                </button>
              </div>
            </div>
          </form>
          <ul className="icons flex justify-center pt-24">
            <li>
              <Link
                href="https://github.com/MikeFreno/"
                target="_blank"
                rel="noreferrer"
                className="hvr-grow-rotate-left rounded-full border-zinc-800 dark:border-zinc-300"
              >
                <span className="m-auto p-2">
                  <GitHub height={24} width={24} fill={"black"} />
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
