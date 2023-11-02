"use client";
import useOnClickOutside from "@/hooks/ClickOutsideHook";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function TagSelector(props: {
  tagMap: Map<string, number>;
  category: "blog" | "project";
}) {
  const [showingMenu, setShowingMenu] = useState<boolean>(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [currentSort, setCurrentSort] = useState<string>("");
  const [currentFilters, setCurrentFilters] = useState<string[]>();

  useOnClickOutside([buttonRef, menuRef], () => setShowingMenu(false));

  useEffect(() => {
    setCurrentSort(searchParams.get("sort") || "");
    setCurrentFilters(searchParams.get("filter")?.split("|"));
  }, [searchParams]);

  const toggleMenu = () => {
    setShowingMenu(!showingMenu);
  };

  const handleCheck = (filter: string, isChecked: boolean) => {
    if (isChecked) {
      const newFilters = searchParams.get("filter")?.replace(filter + "|", "");
      if (newFilters && newFilters.length >= 1) {
        router.push(`?sort=${currentSort}` + "&filter=" + newFilters);
      } else {
        router.push(`?sort=${currentSort}`);
      }
    } else {
      const currentFilters = searchParams.get("filter");
      if (currentFilters) {
        const newFilters = currentFilters + filter + "|";
        const newPathname =
          pathname + "?sort=" + currentSort + "&filter=" + newFilters;
        router.push(newPathname);
      } else {
        const newPathname =
          pathname + "?sort=" + currentSort + "&filter=" + filter + "|";
        router.push(newPathname);
      }
    }
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
            <div className="mx-auo my-1 flex" key={key}>
              <input
                type="checkbox"
                className=""
                defaultChecked={!currentFilters?.includes(key.slice(1))}
                onChange={(e) => handleCheck(key.slice(1), e.target.checked)}
              />
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
