"use client";

import { useState } from "react";
import LikeIcon from "@/icons/LikeIcon";
import { PostLike } from "@/types/model-types";
import { env } from "@/env.mjs";

export default function SessionDependantLike(props: {
  currentUserID: string | undefined | null;
  privilegeLevel: "admin" | "user" | "anonymous";
  likes: PostLike[];
  type: "blog" | "project";
  projectID: number;
}) {
  const [hovering, setHovering] = useState<boolean>(false);
  const [likes, setLikes] = useState<PostLike[]>(props.likes);
  const [instantOffset, setInstantOffset] = useState<number>(0);
  const [hasLiked, setHasLiked] = useState<boolean>(
    props.likes.some((like) => like.user_id == props.currentUserID),
  );

  const giveProjectLike = async () => {
    const data = {
      user_id: props.currentUserID,
      post_id: props.projectID,
      post_type: props.type == "blog" ? "Blog" : "Project",
    };

    const initialHasLiked = hasLiked;
    const initialInstantOffset = hasLiked ? -1 : 1;

    setHasLiked(!hasLiked);
    setInstantOffset(initialInstantOffset);

    try {
      let res;
      if (initialHasLiked) {
        res = await fetch(
          `${env.NEXT_PUBLIC_DOMAIN}/api/database/post-like/remove`,
          {
            method: "POST",
            body: JSON.stringify(data),
          },
        );
      } else {
        res = await fetch(
          `${env.NEXT_PUBLIC_DOMAIN}/api/database/post-like/add`,
          {
            method: "POST",
            body: JSON.stringify(data),
          },
        );
      }

      const resData = await res.json();
      setLikes(resData.newLikes);
      setInstantOffset(0);
    } catch (error) {
      console.error(
        "There has been a problem with your fetch operation:",
        error,
      );
      setHasLiked(initialHasLiked);
      setInstantOffset(0);
    }
  };

  if (props.privilegeLevel !== "anonymous") {
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
          <div
            className={`${
              props.type == "project"
                ? "hover:text-blue-400"
                : "hover:text-orange-400"
            } flex flex-col tooltip text-black dark:text-white`}
          >
            <div className="mx-auto">
              <LikeIcon
                strokeWidth={1}
                color={
                  hasLiked
                    ? props.type == "project"
                      ? "fill-blue-400"
                      : "fill-orange-400"
                    : `dark:fill-${
                        hovering
                          ? props.type == "project"
                            ? "blue-600"
                            : "orange-500"
                          : "white"
                      } fill-${
                        hovering
                          ? props.type == "project"
                            ? "blue-400"
                            : "orange-400"
                          : "black"
                      } ${
                        props.type == "project"
                          ? "hover:fill-blue-400 dark:hover:fill-blue-600"
                          : "hover:fill-orange-400"
                      } `
                }
                height={32}
                width={32}
              />
            </div>
            <div
              className={`${
                hasLiked
                  ? props.type == "project"
                    ? "text-blue-400"
                    : "text-orange-400"
                  : ""
              } mx-auto flex pl-2 transition-colors ease-in duration-200`}
            >
              {likes.length + instantOffset}{" "}
              {likes.length + instantOffset == 1 ? "Like" : "Likes"}
            </div>
            <div className={`tooltip-text px-2 w-12 -ml-14`}>
              {hasLiked ? (
                <div className="px-2">Remove Like</div>
              ) : (
                <div className="px-2 text-center">Leave a Like</div>
              )}
            </div>
          </div>
        </button>
      </>
    );
  } else {
    return (
      <>
        <button className="tooltip flex flex-col">
          <div className="mx-auto">
            <LikeIcon
              strokeWidth={1}
              color={"fill-black dark:fill-white"}
              height={32}
              width={32}
            />
          </div>
          <div
            className="my-auto pl-2 pt-0.5
              text-sm text-black dark:text-white"
          >
            {likes.length} {likes.length == 1 ? "Like" : "Likes"}
          </div>
          <div className="tooltip-text -ml-12 w-12">Must be logged in</div>
        </button>
      </>
    );
  }
}
