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

  const joinBetaPrompt = () => {
    window.alert(
      "This isn't released yet, if you would like to help test, please go the contact page and include the game and platform you would like to help test in the message. Thanks!",
    );
  };

  return (
    <div className="pb-12 pt-[15vh]">
      <div className="text-center text-3xl tracking-widest dark:text-white">
        Downloads
      </div>
      <div className="pt-12">
        <div className="text-center text-xl tracking-wide dark:text-white">
          Cork
          <br />
          (macOS 13 Ventura or later)
        </div>
        <div className="flex justify-center">
          <button
            onClick={() => download("cork")}
            className="my-2 rounded-md bg-blue-500 px-4 py-2 text-white shadow-lg shadow-blue-800 transition-all duration-200 ease-out hover:opacity-90 active:scale-95 active:opacity-90"
          >
            Download app
          </button>
        </div>
        <div className="text-center text-sm">
          Just unzip and drag into &apos;Applications&apos; folder
        </div>
      </div>
      <div className="pt-12">
        <div className="text-center text-xl tracking-wide dark:text-white">
          Shapes with Abigail!
          <br />
          (apk and iOS)
        </div>
        <div className="flex justify-evenly md:mx-[25vw]">
          <div className="flex flex-col">
            <div className="text-center text-lg">Android</div>
            <button
              onClick={joinBetaPrompt}
              className="transition-all duration-200 ease-out active:scale-95"
            >
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
        <div className="text-center text-xl tracking-wide dark:text-white">
          Magic Delve (alpha)
          <br />
          (apk only)
        </div>
        <div className="flex justify-evenly md:mx-[25vw]">
          <div className="flex flex-col">
            <div className="text-center text-lg">Android</div>
            <button
              onClick={joinBetaPrompt}
              className="transition-all duration-200 ease-out active:scale-95"
            >
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
              onClick={joinBetaPrompt}
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
