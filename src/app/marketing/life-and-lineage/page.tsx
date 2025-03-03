import React from "react";
import SimpleParallax from "@/components/SimpleParallax";
import Image from "next/image";
import Link from "next/link";
import DownloadOnAppStoreDark from "@/icons/DownloadOnAppStoreDark";

export default function LifeAndLineageMarketing() {
  return (
    <SimpleParallax>
      <div className="flex flex-col items-center justify-center h-full text-white">
        <div>
          <Image
            src={"/LineageIcon.png"}
            alt={"Lineage App Icon"}
            height={128}
            width={128}
            className="object-cover object-center"
          />
        </div>
        <h1 className="text-5xl font-bold mb-4 text-center">
          Life and Lineage
        </h1>
        <p className="text-xl mb-8">A dark fantasy adventure</p>
        <div className="flex space-x-4">
          <Link
            className="my-auto transition-all duration-200 ease-out active:scale-95"
            href="#"
          >
            <DownloadOnAppStoreDark size={50} />
          </Link>
          <Link
            href="#"
            className="transition-all duration-200 ease-out active:scale-95"
          >
            <Image
              src={"/google-play-badge.png"}
              alt={"google-play"}
              width={180}
              height={60}
            />
          </Link>
        </div>
      </div>
    </SimpleParallax>
  );
}
