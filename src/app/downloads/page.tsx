"use client";

import DownloadOnAppStore from "@/icons/DownloadOnAppStore";
import Image from "next/image";
import Link from "next/link";

export default function DownloadPage() {
  const download = (assetName: string) => {
    fetch(`/api/downloads/public/${assetName}`)
      .then((response) => response.json())
      .then((data) => {
        const url = data.downloadURL;
        window.location.href = url;
      })
      .catch((error) => console.error(error));
  };

  return (
    <div className="pt-[15vh]">
      <div className="text-center text-3xl tracking-widest dark:text-white">
        Downloads
      </div>
      <div className="pt-12">
        <div className="tracking wide text-center text-xl dark:text-white">
          Shapes with Abigail!
        </div>
        <div className="mx-[25vw] flex justify-evenly">
          <div className="flex flex-col">
            <div className="text-center text-lg">Android</div>
            <button className="transition-all duration-200 ease-out active:scale-95">
              <Image
                src={"/google-play-badge.png"}
                alt={"google-play"}
                width={180}
                height={60}
              />
            </button>
            <div className="rule-around">Or</div>
            <button
              onClick={() => download("shapes-with-abigail")}
              className="mt-2 rounded-md bg-blue-500 px-4 py-2 text-white shadow-lg shadow-blue-800 transition-all duration-200 ease-out hover:opacity-90 active:scale-95 active:opacity-90"
            >
              Download APK
            </button>
          </div>
          <div className="flex flex-col">
            <div className="text-center text-lg">iOS</div>
            <Link
              className="my-auto transition-all duration-200 ease-out active:scale-95"
              href="https://apps.apple.com/us/app/shapes-with-abigail/id6474561117"
            >
              <DownloadOnAppStore size={50} />
            </Link>
          </div>
        </div>
      </div>
      <div className="pt-12">
        <div className="tracking wide text-center text-xl dark:text-white">
          Magic Delve (alpha)
        </div>
        <div className="mx-[25vw] flex justify-evenly">
          <div className="flex flex-col">
            <div className="text-center text-lg">Android</div>
            <button className="transition-all duration-200 ease-out active:scale-95">
              <Image
                src={"/google-play-badge.png"}
                alt={"google-play"}
                width={180}
                height={60}
              />
            </button>
            <div className="rule-around">Or</div>
            <button
              onClick={() => download("magic-delve")}
              className="mt-2 rounded-md bg-blue-500 px-4 py-2 text-white shadow-lg shadow-blue-800 transition-all duration-200 ease-out hover:opacity-90 active:scale-95 active:opacity-90"
            >
              Download APK
            </button>
          </div>
          <div className="flex flex-col">
            <div className="text-center text-lg">iOS</div>
            <button
              className="my-auto transition-all duration-200 ease-out active:scale-95"
              //href="https://apps.apple.com/us/app/shapes-with-abigail/id6474561117"
            >
              <DownloadOnAppStore size={50} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
