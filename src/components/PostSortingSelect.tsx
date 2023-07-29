"use client";
import { Fragment, useEffect, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import Check from "@/icons/Check";
import UpDownArrows from "@/icons/UpDownArrows";
import { useRouter } from "next/navigation";
const sorting = [
  { val: "Newest" },
  { val: "Oldest" },
  { val: "Most Liked" },
  { val: "Most Read" },
  { val: "Most Comments" },
];

export default function PostSortingSelect(props: {
  type: "blog" | "projects";
}) {
  const [selected, setSelected] = useState(sorting[0]);
  const router = useRouter();

  useEffect(() => {
    router.push(`${props.type}?sort=${selected.val.toLowerCase()}`);
  }, [selected, props.type, router]);

  return (
    <div className="w-72">
      <Listbox value={selected} onChange={setSelected}>
        <div className="relative mt-1 z-10">
          <Listbox.Button
            className={`${
              props.type == "projects"
                ? "focus-visible:ring-offset-blue-300 focus-visible:border-blue-600"
                : "focus-visible:ring-offset-orange-300 focus-visible:border-orange-600"
            } relative w-full cursor-default rounded-lg bg-white dark:bg-zinc-900 py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2  sm:text-sm`}
          >
            <span className="block truncate">{selected.val}</span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <UpDownArrows
                strokeWidth={1.5}
                height={24}
                width={24}
                className="fill-zinc-900 dark:fill-white"
              />
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white dark:bg-zinc-900 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {sorting.map((sort, sortIndex) => (
                <Listbox.Option
                  key={sortIndex}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                      active
                        ? props.type == "projects"
                          ? "bg-blue-100 text-blue-900"
                          : "bg-orange-100 text-orange-900"
                        : "text-zinc-900 dark:text-white"
                    }`
                  }
                  value={sort}
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? "font-medium" : "font-normal"
                        }`}
                      >
                        {sort.val}
                      </span>
                      {selected ? (
                        <span
                          className={`${
                            props.type == "projects"
                              ? "text-blue-600"
                              : "text-orange-600"
                          } absolute inset-y-0 left-0 flex items-center pl-3`}
                        >
                          <Check
                            strokeWidth={1}
                            height={24}
                            width={24}
                            className="stroke-zinc-900 dark:stroke-white"
                          />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
}
