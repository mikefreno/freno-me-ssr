"use client";

import { deletePost } from "@/app/globalActions";
import TrashIcon from "@/icons/TrashIcon";
import React, { useState } from "react";
import LoadingSpinner from "./LoadingSpinner";

export default function DeletePostButton(props: {
  type: string;
  postId: number;
}) {
  const [loading, setLoading] = useState<boolean>(false);
  const deletePostTrigger = async (e: React.FormEvent) => {
    e.preventDefault();
    const affirm = window.confirm("Are you sure you want to delete?");
    if (affirm) {
      setLoading(true);
      const res = await deletePost({ type: props.type, postId: props.postId });
      if (res !== "good") {
        alert(res);
      }
      setLoading(false);
    }
  };
  return (
    <form onSubmit={deletePostTrigger} className="flex justify-end w-full">
      <button type="submit">
        {loading ? (
          <LoadingSpinner height={24} width={24} />
        ) : (
          <TrashIcon
            height={24}
            width={24}
            stroke={"black"}
            strokeWidth={1.5}
          />
        )}
      </button>
    </form>
  );
}
