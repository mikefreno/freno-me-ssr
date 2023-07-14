"use client";
import UserDefaultImage from "@/icons/UserDefaultImage";
import React, { useEffect, useRef, useState } from "react";
import ReplyIcon from "@/icons/ReplyIcon";
import CommentInputBlock from "./CommentInputBlock";
import ReactionBar from "./ReactionBar";
import ThumbsUpEmoji from "@/icons/emojis/ThumbsUp.svg";
import { Comment, CommentReaction, User } from "@/types/model-types";
import useSWR from "swr";
import { env } from "@/env.mjs";
import Image from "next/image";
import { usePathname } from "next/navigation";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function CommentBlock(props: {
  comment: Comment;
  category: "project" | "blog";
  projectID: number;
  recursionCount: number;
  allComments: Comment[];
  child_comments: Comment[];
  privilegeLevel: "admin" | "user" | "anonymous";
  userID: string;
}) {
  const { data: reactionData, error: reactionError } = useSWR(
    `/api/database/comment-reactions/${props.comment.id}`,
    fetcher
  );

  const { data: userData, error: userDataError } = useSWR(
    `/api/database/comment-reactions/${props.comment.id}`,
    fetcher
  );

  const commentReactions = reactionData.commentReactions as CommentReaction[];
  const commenterUserData = userData.user as User;

  const [commentCollapsed, setCommentCollapsed] = useState<boolean>(false);
  const [showingReactionOptions, setShowingReactionOptions] =
    useState<boolean>(false);
  const [replyBoxShowing, setReplyBoxShowing] = useState<boolean>(false);
  const [showingReplyInput, setShowingReplyInput] = useState<boolean>(false);
  const [toggleHeight, setToggleHeight] = useState<number>(0);

  const containerRef = useRef<HTMLDivElement>(null);

  const pathname = usePathname();
  useEffect(() => {
    if (containerRef.current) {
      setToggleHeight(containerRef.current.offsetHeight);
    }
  }, [containerRef]);

  const collapseCommentToggle = () => {
    setCommentCollapsed(!commentCollapsed);
  };
  const showingReactionOptionsToggle = () => {
    setShowingReactionOptions(!showingReactionOptions);
  };
  const toggleCommentReplyBox = () => {
    setReplyBoxShowing(!replyBoxShowing);
  };

  const upVoteHandler = () => {
    if (
      commentReactions
        .filter((commentReaction) => commentReaction.type == "upVote")
        .some((commentReaction) => commentReaction.user_id == props.userID)
    ) {
      // remove upVote
    } else if (
      commentReactions
        .filter((commentReaction) => commentReaction.type == "downVote")
        .some((commentReaction) => commentReaction.user_id == props.userID)
    ) {
      // remove upvote, give downvote
    } else {
      //give upvote
    }
  };
  const downVoteHandler = () => {
    if (
      commentReactions
        .filter((commentReaction) => commentReaction.type == "downVote")
        .some((commentReaction) => commentReaction.user_id == props.userID)
    ) {
      // remove downvote
    } else if (
      commentReactions
        .filter((commentReaction) => commentReaction.type == "upVote")
        .some((commentReaction) => commentReaction.user_id == props.userID)
    ) {
      // remove downvote, give upvote
    } else {
      //give downvote
    }
  };

  return (
    <>
      <button
        onClick={collapseCommentToggle}
        className={!commentCollapsed ? "hidden" : "ml-[38px] w-full px-2"}
      >
        <div className="mr-2 h-6 border-l-2 border-black dark:border-white" />
      </button>
      <div className={commentCollapsed ? "hidden" : ""}>
        <div ref={containerRef} className="my-2 flex h-fit w-full">
          <div className="my-auto flex pr-2">
            {commentReactions.filter(
              (commentReaction) => commentReaction.type == "upVote"
            ).length -
              commentReactions.filter(
                (commentReaction) => commentReaction.type == "downVote"
              ).length}
          </div>
          <div
            className="flex flex-col justify-between"
            style={{ height: toggleHeight }}
          >
            <button onClick={() => upVoteHandler()}>
              <div
                className={`h-5 w-5 ${
                  commentReactions
                    .filter(
                      (commentReaction) => commentReaction.type == "upVote"
                    )
                    .some(
                      (commentReaction) =>
                        commentReaction.user_id == props.userID
                    )
                    ? "fill-emerald-500"
                    : "fill-black dark:fill-white"
                }`}
              >
                <ThumbsUpEmoji />
              </div>
            </button>
            <button onClick={() => downVoteHandler()}>
              <div
                className={`h-5 w-5 rotate-180 ${
                  commentReactions
                    .filter(
                      (commentReaction) => commentReaction.type == "downVote"
                    )
                    .some(
                      (commentReaction) =>
                        commentReaction.user_id == props.userID
                    )
                    ? "fill-rose-500"
                    : "fill-black dark:fill-white"
                }`}
              >
                <ThumbsUpEmoji />
              </div>
            </button>
          </div>
          <button onClick={collapseCommentToggle} className="px-2">
            <div
              className="border-l-2 border-black dark:border-white"
              style={{ height: toggleHeight }}
            />
          </button>
          <button className="w-full" onClick={showingReactionOptionsToggle}>
            <div className="flex">{props.comment.body}</div>
            <div className="flex pl-2">
              <Image
                src={
                  env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME +
                    commenterUserData.image || "/userDefaultImage.svg"
                }
                alt="userIcon"
                className="h-6 w-6 rounded-full"
              />
              <div className="px-1">{commenterUserData.email}</div>
              <div className="px-1">
                <button onClick={toggleCommentReplyBox}>
                  <ReplyIcon
                    color={
                      pathname.split("/")[1] == "blog" ? "#fb923c" : "#60a5fa"
                    }
                    height={24}
                    width={24}
                  />
                </button>
              </div>
              <div className={`${showingReactionOptions ? "" : "hidden"}`}>
                <ReactionBar
                  commentID={props.comment.id}
                  currentUser={undefined}
                />
              </div>
            </div>
          </button>
        </div>
        <div
          className={`${showingReplyInput ? "fade-in" : "hidden"} opacity-0`}
          style={{ marginLeft: `${-96 * props.recursionCount}px` }}
        >
          <CommentInputBlock
            isReply={true}
            privilegeLevel={props.privilegeLevel}
          />
        </div>
        <div className="pl-16">
          {props.child_comments.map((this_comment) => (
            <CommentBlock
              key={this_comment.id}
              comment={this_comment}
              category={"project"}
              projectID={props.projectID}
              recursionCount={1}
              allComments={props.allComments}
              child_comments={props.allComments.filter(
                (comment) => comment.parent_comment_id == this_comment.id
              )}
              privilegeLevel={props.privilegeLevel}
              userID={""}
            />
          ))}
        </div>
      </div>
    </>
  );
}
