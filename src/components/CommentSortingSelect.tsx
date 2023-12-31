"use client";
import { Dispatch, Fragment, SetStateAction } from "react";
import { Listbox, Transition } from "@headlessui/react";
import Check from "@/icons/Check";
import UpDownArrows from "@/icons/UpDownArrows";

export default function CommentSortingSelect(props: {
  type: "blog" | "project";
  commentSorting: {
    val: string;
  }[];
  selectedSorting: {
    val: string;
  };
  setSelectedSorting: Dispatch<
    SetStateAction<{
      val: string;
    }>
  >;
}) {
  return (
    <div className="mt-2 flex justify-center">
      <div className="w-72">
        <Listbox
          value={props.selectedSorting}
          onChange={props.setSelectedSorting}
        >
          <div className="relative z-40 mt-1">
            <Listbox.Button
              className={`${
                props.type == "project"
                  ? "focus-visible:border-blue-600 focus-visible:ring-offset-blue-300"
                  : "focus-visible:border-orange-600 focus-visible:ring-offset-orange-300"
              } relative w-full cursor-default rounded-lg bg-white dark:bg-zinc-900 py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2  sm:text-sm`}
            >
              <span className="block truncate">
                {props.selectedSorting.val}
              </span>
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
              leave="transition duration-100 ease-in"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-zinc-900 sm:text-sm">
                {props.commentSorting.map((sort, sortIndex) => (
                  <Listbox.Option
                    key={sortIndex}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-10 pr-4 ${
                        active
                          ? props.type == "project"
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
                              props.type == "project"
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
    </div>
  );
}
