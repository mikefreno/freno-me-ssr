import { useState, useEffect, ReactNode } from "react";
import Link from "next/link";
import Xmark from "@/icons/Xmark";

interface GameReleaseToastProps {
  message: string;
  link: string;
  icon?: ReactNode;
  duration?: number;
}

export default function GameReleaseToast({
  message,
  link,
  icon,
  duration = 50_000,
}: GameReleaseToastProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    let hideTimer: NodeJS.Timeout | null = null;
    if (duration) {
      hideTimer = setTimeout(() => {
        setIsVisible(false);
      }, duration + 100);
    }

    return () => {
      clearTimeout(timer);
      if (hideTimer) clearTimeout(hideTimer);
    };
  }, [duration]);

  return (
    <div className="w-full flex justify-center">
      <div
        className={`
        fixed top-10 z-50 flex max-w-md px-6 py-3 bg-zinc-800 text-white rounded-lg shadow-lg cursor-pointer transition-all duration-500 ease-in-out transform apply-seesaw-animation
        ${
          isVisible
            ? "opacity-100 translate-x-[-50%] translate-y-0"
            : "opacity-0 translate-x-[-50%] -translate-y-full"
        }
      `}
      >
        <Link href={link} className="flex">
          {icon}
          <div>{message}</div>
        </Link>
        <button onClick={() => setIsVisible(false)} className="z-[100] -mr-4">
          <Xmark strokeWidth={2} color={"white"} height={24} width={24} />
        </button>
      </div>
    </div>
  );
}
