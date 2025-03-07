import GitHubIcon from "@/icons/GitHub";
import LinkedInIcon from "@/icons/LinkedIn";
import Xmark from "@/icons/Xmark";
import Link from "next/link";
import { RefObject } from "react";

export default function AboutMeModal({
  showing,
  aboutRef,
  aboutToggle,
}: AboutMeProps) {
  return (
    <>
      <div
        className={`${
          showing
            ? "fade-in flex"
            : "absolute -translate-x-full backdrop-blur-0 backdrop-brightness-100"
        } w-full h-screen justify-center overflow-scroll pb-36 pt-24 md:pb-[20vh] md:pt-[10vh] opacity-0 backdrop-blur-sm backdrop-brightness-75`}
      >
        <div
          ref={aboutRef}
          className={`${
            showing ? "" : "translate-y-full"
          } h-fit w-11/12 rounded border border-white bg-white bg-opacity-10 px-4 py-2 md:w-2/3 lg:w-1/2 md:px-10 md:py-6 xl:w-5/12 transition-all duration-700 ease-in-out`}
        >
          <div className="-mb-11 flex justify-end">
            <button onClick={aboutToggle}>
              <Xmark strokeWidth={0.5} color={"white"} height={50} width={50} />
            </button>
          </div>
          <article>
            <h2 className="text-3xl font-light tracking-wide underline underline-offset-4">
              About Me
            </h2>
            <div className="-mx-4 py-4 md:-mx-10">
              <div className="h-[30vh] w-full  bg-[url('/me_in_flannel.jpg')] bg-cover bg-center bg-no-repeat" />
            </div>
            <p>
              Hello! I&apos;m Mike Freno, a passionate software developer. My
              journey into this field has been quite unique. I initially
              explored various fields including genetics and then finance,
              before discovering my true calling in programming. I&apos;ve
              always been fascinated by computers and technology, and even took
              a course on Java during my undergraduate studies. Looking back, it
              seems inevitable that I would find my way into this exciting
              profession.
            </p>
            <br />
            <p>
              This website serves as a showcase of my technical abilities, some
              of which you can explore{" "}
              <Link
                href="/projects"
                className="text-white underline underline-offset-4 hover:text-blue-400 hover:underline"
              >
                here
              </Link>
              . Additionally, it&apos;s a platform where I share my thoughts and
              insights on topics that intrigue me, primarily revolving around{" "}
              <Link
                href="/blog"
                className="text-white underline underline-offset-4 hover:text-yellow-400 hover:underline"
              >
                Bitcoin, economics, and other tech-related subjects
              </Link>
              .
            </p>
            <ul className="icons flex justify-center py-4">
              <li>
                <Link
                  href="https://github.com/MikeFreno/"
                  target="_blank"
                  rel="noreferrer"
                  className="shaker rounded-full border-zinc-800 dark:border-zinc-300"
                >
                  <span className="m-auto">
                    <GitHubIcon height={16} width={16} fill={"white"} />
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  href="https://www.linkedin.com/in/michael-freno-176001256/"
                  target="_blank"
                  rel="noreferrer"
                  className="shaker rounded-full border-zinc-800 dark:border-zinc-300"
                >
                  <span className="m-auto">
                    <LinkedInIcon height={16} width={16} fill={"white"} />
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
  aboutRef: RefObject<HTMLDivElement | null>;
  aboutToggle: () => void;
}
