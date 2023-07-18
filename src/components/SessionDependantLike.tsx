"use client";

import { useState } from "react";
import LoadingSpinner from "./LoadingSpinner";
import LikeIcon from "@/icons/LikeIcon";
import { BlogLike, ProjectLike } from "@/types/model-types";
import { env } from "@/env.mjs";

export default function SessionDependantLike(props: {
  currentUserID: string | undefined;
  privilegeLevel: "admin" | "user" | "anonymous";
  likes: ProjectLike[] | BlogLike[];
  type: "blog" | "project";
  projectID: number;
}) {
  const [likeButtonLoading, setLikeButtonLoading] = useState<boolean>(false);
  const [hovering, setHovering] = useState<boolean>(false);
  const [likes, setLikes] = useState<ProjectLike[] | BlogLike[]>(props.likes);

  const giveProjectLike = async () => {
    setLikeButtonLoading(true);
    const data = {
      user_id: props.currentUserID,
      post_id: props.projectID,
      post_type: props.type == "blog" ? "Blog" : "Project",
    };
    if (likes.some((like) => like.user_id == props.currentUserID)) {
      const res = await fetch(
        `${env.NEXT_PUBLIC_DOMAIN}/api/database/generic/post-like/remove`,
        {
          method: "POST",
          body: JSON.stringify(data),
        }
      );
      const resData = await res.json();
      4;
      setLikes(resData.newLikes);
    } else {
      const res = await fetch(
        `${env.NEXT_PUBLIC_DOMAIN}/api/database/generic/post-like/add`,
        {
          method: "POST",
          body: JSON.stringify(data),
        }
      );
      const resData = await res.json();
      setLikes(resData.newLikes);
    }

    setLikeButtonLoading(false);
  };

  if (likeButtonLoading) {
    return <LoadingSpinner height={24} width={24} />;
  } else if (props.privilegeLevel != "anonymous") {
    return (
      <>
        <button
          onClick={() => giveProjectLike()}
          onMouseOver={() => {
            setHovering(true);
          }}
          onMouseLeave={() => {
            setHovering(false);
          }}
        >
          <div className="flex flex-col tooltip hover:text-blue-400 text-black dark:text-white">
            <div className="mx-auto">
              <LikeIcon
                strokeWidth={1}
                color={
                  likes.some((like) => like.user_id == props.currentUserID)
                    ? "fill-blue-400"
                    : `dark:fill-${hovering ? "blue-600" : "white"} fill-${
                        hovering ? "blue-400" : "black"
                      } hover:fill-blue-400 dark:hover:fill-blue-600`
                }
                height={32}
                width={32}
              />
            </div>
            <div
              className={`${
                likes.some((like) => like.user_id == props.currentUserID)
                  ? "text-blue-400"
                  : ""
              } mx-auto flex pl-2 transition-colors ease-in duration-200`}
            >
              {likes.length} {likes.length == 1 ? "Like" : "Likes"}
            </div>
            <div className="tooltip-text px-2">Leave a Like</div>
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
            {likes.length} {likes.length == 1 ? "Like" : "Likes"}
          </div>
          <div className="tooltip-text">Must be logged in to Like</div>
        </button>
      </>
    );
  }
}
