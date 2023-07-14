import Xmark from "@/icons/Xmark";
import { RefObject } from "react";
import { sendContactRequest } from "./globalActions";

export default function ContactModal(props: ContactModalProps) {
  return (
    <>
      <div
        className={`${
          props.showing ? "fade-in flex" : "hidden"
        } w-full justify-center overflow-scroll py-[15vh] opacity-0 backdrop-blur-sm transition-all`}
      >
        <div
          ref={props.contactRef}
          className="h-fit w-3/4 rounded border border-white bg-white bg-opacity-10 px-4 py-2 md:w-2/3 md:px-12 md:py-6 lg:w-1/2"
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
              <div className="flex justify-evenly">
                <div className="input-group home">
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
                <div className="input-group home">
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
