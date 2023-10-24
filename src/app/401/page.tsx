"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Page_401() {
  const router = useRouter();

  function doubleBack() {
    router.back();
    router.back();
  }

  return (
    <div className="h-full w-full">
      <div className="image-overlay fixed h-full w-full brightness-75">
        <picture className="h-80 w-full object-cover sm:h-96 md:h-[50vh]">
          <source
            srcSet="/WhiteLogo.png"
            media="(prefers-color-scheme: dark)"
          />
          <img src="/BlackLogo.png" alt="logo" />
        </picture>
      </div>
      <div
        className={`text-shadow fixed pt-56 backdrop-blur-sm h-full w-full brightness-150 z-10 select-text text-center tracking-widest text-white`}
      >
        <div className="z-10 mx-auto w-3/4 text-2xl font-light tracking-wide md:w-1/2">
          You lack authentication sufficient for that page
        </div>
        <button
          onClick={doubleBack}
          className="mx-auto mt-6 flex w-36 justify-center rounded bg-blue-600 py-3 text-lg font-light tracking-wide text-white shadow-lg shadow-blue-700 transition-all  duration-300 ease-out hover:bg-blue-700 active:scale-90"
        >
          Go Back
        </button>
      </div>
    </div>
  );
}
