"use client";
import useOnClickOutside from "@/hooks/ClickOutsideHook";
import { useRef, useState } from "react";

export default function TagSelector(props: {
  tagMap: Map<string, number>;
  category: "blog" | "project";
}) {
  const [showingMenu, setShowingMenu] = useState<boolean>(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useOnClickOutside([buttonRef, menuRef], () => setShowingMenu(false));

  const toggleMenu = () => {
    setShowingMenu(!showingMenu);
  };

  return (
    <>
      <button
        onClick={toggleMenu}
        ref={buttonRef}
        className={`${
          props.category == "project"
            ? "border-blue-500 bg-blue-400 hover:bg-blue-500 dark:border-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
            : "border-orange-500 bg-orange-400 hover:bg-orange-500 dark:border-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700"
        } rounded border px-4 py-2 text-white shadow-md transition-all duration-300  ease-in-out active:scale-90`}
      >
        Filters
      </button>
      {showingMenu ? (
        <div
          ref={menuRef}
          className="absolute z-50 mt-12 rounded-lg bg-zinc-100 p-2 shadow-lg dark:bg-zinc-900"
        >
          {Array.from(props.tagMap).map(([key, value]) => (
            <div className="mx-auto my-1 flex" key={key}>
              <input type="checkbox" className="" />
              <div className="-mt-0.5 pl-1 text-sm font-normal">
                {`${key.slice(1)} (${value}) `}
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </>
  );
}
