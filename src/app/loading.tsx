import Image from "next/image";
import { useContext } from "react";

export default function Loading() {
  return (
    <div className="h-screen w-screen flex flex-col justify-center">
      <picture className="animate-spin-reverse mx-auto">
        <source srcSet="/WhiteLogo.png" media="(prefers-color-scheme: dark)" />
        <img src="/BlackLogo.png" alt="logo" width={80} height={80} />
      </picture>
    </div>
  );
}
