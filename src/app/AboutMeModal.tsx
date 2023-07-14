import GitHub from "@/icons/GitHub";
import LinkedIn from "@/icons/LinkedIn";
import Xmark from "@/icons/Xmark";
import Link from "next/link";
import { RefObject } from "react";

export default function AboutMeModal(props: AboutMeProps) {
  return (
    <>
      <div
        className={`${
          props.showing ? "fade-in flex" : "hidden"
        } justify-center overflow-scroll py-[15vh] opacity-0 backdrop-blur-sm transition-all`}
      >
        <div
          ref={props.aboutRef}
          className="h-fit w-3/4 rounded border border-white bg-white bg-opacity-10 px-4 py-2 md:w-2/3 md:px-12 md:py-6 lg:w-1/2"
        >
          <div className="-my-6 flex justify-end pt-4 md:pt-2">
            <button onClick={props.aboutToggle}>
              <Xmark strokeWidth={0.5} color={"white"} height={50} width={50} />
            </button>
          </div>
          <article>
            <h2 className="text-3xl font-light tracking-wide underline underline-offset-4">
              About Me
            </h2>
            <div className="-mx-4 py-4 md:-mx-12">
              <div className="h-[30vh] w-full  bg-[url('/me_in_flannel.jpg')] bg-cover bg-center bg-no-repeat" />
            </div>
            <p>
              My name is Mike Freno, and I&apos;m a software developer. I came
              to this profession in a nonlinear path. While searching for other
              career paths I developed an interest in business and finance,
              before settling in on programming. I had taken a course on java
              during my undergraduate and have had a lifelong interest in
              computers (building many myself) and how it all worked, so in
              someways it&apos;s odd I hadn&apos;t gone down this career path
              earlier.
            </p>
            <br />
            <p>
              This website serves as a display of some of my technical skills
              some of which you can find{" "}
              <Link
                href="/projects"
                className="text-white underline underline-offset-4 hover:text-blue-400 hover:underline"
              >
                here
              </Link>
              . As well as a place for me to write about things that interest
              me, mostly surrounding{" "}
              <Link
                href="/blog"
                className="text-white underline underline-offset-4 hover:text-yellow-400 hover:underline"
              >
                bitcoin, economics and other tech related topics
              </Link>
              .
            </p>
            <ul className="icons flex justify-center py-4">
              <li>
                <Link
                  href="https://github.com/MikeFreno/"
                  target="_blank"
                  rel="noreferrer"
                  className="hvr-grow-rotate-left rounded-full border-zinc-800 dark:border-zinc-300"
                >
                  <span className="m-auto">
                    <GitHub height={16} width={16} fill={"white"} />
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
                  <span className="m-auto">
                    <LinkedIn height={16} width={16} fill={"white"} />
                  </span>
                </Link>
              </li>
            </ul>
          </article>
        </div>
      </div>
    </>
  );
}

interface AboutMeProps {
  showing: boolean;
  aboutRef: RefObject<HTMLDivElement>;
  aboutToggle: () => void;
}
