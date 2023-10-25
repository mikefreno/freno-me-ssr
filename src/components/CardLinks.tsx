"use client";

import Link from "next/link";
import { useState } from "react";
import LoadingSpinner from "./LoadingSpinner";

export default function CardLinks(props: {
  postTitle: string;
  postID: number;
  linkTarget: string;
  privilegeLevel: string;
}) {
  const [readLoading, setReadingLoading] = useState<boolean>(false);
  const [editLoading, setEditLoading] = useState<boolean>(false);
  return (
    <div className="flex flex-col">
      <Link
        onClick={() => setReadingLoading(true)}
        href={`/${props.linkTarget}/${props.postTitle}`}
        className={`${
          readLoading
            ? "bg-zinc-400"
            : props.linkTarget == "projects"
            ? "bg-blue-400 hover:bg-blue-500 dark:bg-blue-600 dark:hover:bg-blue-700"
            : "bg-orange-400 hover:bg-orange-500"
        } active:scale-90 flex transition-all duration-300 ease-out shadow text-white rounded px-4 py-2 ml-2`}
      >
        {readLoading ? <LoadingSpinner height={24} width={24} /> : "Read"}
      </Link>
      {props.privilegeLevel === "admin" && (
        <Link
          onClick={() => setEditLoading(true)}
          href={`/${props.linkTarget}/edit/${props.postID}`}
          className={`${
            editLoading ? "bg-zinc-400" : "bg-green-400 hover:bg-green-500"
          } active:scale-90 flex transition-all duration-300 ease-out text-white rounded shadow px-4 py-2 ml-2 mt-1`}
        >
          {editLoading ? <LoadingSpinner height={24} width={24} /> : "Edit"}
        </Link>
      )}
    </div>
  );
}
