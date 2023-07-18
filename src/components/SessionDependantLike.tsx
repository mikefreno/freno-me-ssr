"use client";

import { useState } from "react";
import LoadingSpinner from "./LoadingSpinner";
import LikeIcon from "@/icons/LikeIcon";
import { BlogLike, ProjectLike } from "@/types/model-types";

export default function SessionDependantLike(props: {
  currentUserID: string | undefined;
  privilegeLevel: "admin" | "user" | "anonymous";
  likes: ProjectLike[] | BlogLike[];
  type: "blog" | "project";
  projectID: number;
}) {
  const [likeButtonLoading, setLikeButtonLoading] = useState<boolean>(false);

  const giveProjectLike = async () => {
    setLikeButtonLoading(true);

    const res = await fetch(``, { method: "POST" });

    setLikeButtonLoading(false);
  };

  if (likeButtonLoading) {
    return <LoadingSpinner height={24} width={24} />;
  } else if (props.privilegeLevel != "anonymous") {
    return (
      <>
        <button onClick={() => giveProjectLike()}>
          <div className="flex flex-col tooltip hover:text-blue-400 text-black dark:text-white">
            <div className="mx-auto">
              <LikeIcon
                strokeWidth={1}
                color={
                  props.likes.some(
                    (like) => like.user_id == props.currentUserID
                  )
                    ? "fill-blue-400"
                    : "dark:fill-white fill-black hover:fill-blue-400"
                }
                height={32}
                width={32}
              />
            </div>
            <div
              className={`${
                props.likes.some((like) => like.user_id == props.currentUserID)
                  ? "text-blue-400"
                  : ""
              } mx-auto flex pl-2 transition-colors ease-in duration-200`}
            >
              {props.likes.length} {props.likes.length == 1 ? "Like" : "Likes"}
            </div>

            <div className="tooltip-text">Leave a Like</div>
          </div>
        </button>
      </>
    );
  } else {
    return (
      <>
        <button className="flex tooltip flex-row hover:brightness-50 h-min whitespace-nowrap">
          <LikeIcon
            strokeWidth={1}
            color={"dark:fill-white fill-black"}
            height={32}
            width={32}
          />
          <div
            className="my-auto pl-2
              text-black dark:text-white text-sm"
          >
            {props.likes.length} {props.likes.length == 1 ? "Like" : "Likes"}
          </div>
          <div className="tooltip-text">Must be logged in to Like</div>
        </button>
      </>
    );
  }
}
