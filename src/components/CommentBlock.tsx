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
import Link from "next/link";
import Cookies from "js-cookie";
import { set } from "zod";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  const data = await res.json();

  return { data, status: res.status };
};

export default function CommentBlock(props: {
  commentRefreshTrigger: () => void;
  comment: Comment;
  category: "project" | "blog";
  projectID: number;
  recursionCount: number;
  allComments: Comment[];
  child_comments: Comment[];
  privilegeLevel: "admin" | "user" | "anonymous";
  userID: string;
  reactionMap: Map<number, CommentReaction[]>;
}) {
  const { data: userData, error: reactionError } = useSWR(
    `/api/user-data/cookie/${props.comment.commenter_id}`,
    fetcher
  );

  const [commentCollapsed, setCommentCollapsed] = useState<boolean>(false);
  const [showingReactionOptions, setShowingReactionOptions] =
    useState<boolean>(false);
  const [replyBoxShowing, setReplyBoxShowing] = useState<boolean>(false);
  const [toggleHeight, setToggleHeight] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [reactions, setReactions] = useState<CommentReaction[]>([]);
  const [pointFeedbackOffset, setPointFeedbackOffset] = useState<number>(0);
  const pathname = usePathname();
  const commentInputRef = useRef<HTMLDivElement>(null);
  const [immediateLike, setImmediateLike] = useState<boolean>(false);
  const [immediateDislike, setImmediateDislike] = useState<boolean>(false);

  useEffect(() => {
    if (containerRef.current) {
      setToggleHeight(containerRef.current.offsetHeight);
    }
  }, [containerRef, showingReactionOptions]);

  useEffect(() => {
    setReactions(props.reactionMap.get(props.comment.id) || []);
  }, [props.comment, props.reactionMap]);

  const collapseCommentToggle = () => {
    setCommentCollapsed(!commentCollapsed);
  };
  const showingReactionOptionsToggle = () => {
    setShowingReactionOptions(!showingReactionOptions);
  };
  const toggleCommentReplyBox = (event: React.MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();
    setReplyBoxShowing(!replyBoxShowing);
    setTimeout(() => {
      if (commentInputRef.current) {
        commentInputRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, 50);
  };

  const upVoteHandler = async () => {
    const data = {
      comment_id: props.comment.id,
      user_id: Cookies.get("userIDToken"),
    };

    if (
      reactions
        .filter((commentReaction) => commentReaction.type == "upVote")
        .some((commentReaction) => commentReaction.user_id == props.userID)
    ) {
      setPointFeedbackOffset(-1);
      setImmediateLike(false);
      const removeRes = await fetch(
        `${env.NEXT_PUBLIC_DOMAIN}/api/database/comment-reactions/remove/upVote`,
        { method: "POST", body: JSON.stringify(data) }
      );
      const resData = await removeRes.json();
      setReactions(resData.commentReactions);
      setPointFeedbackOffset(0);
      setImmediateDislike(false);
      setImmediateLike(false);
    } else if (
      reactions
        .filter((commentReaction) => commentReaction.type == "downVote")
        .some((commentReaction) => commentReaction.user_id == props.userID)
    ) {
      setPointFeedbackOffset(2);
      setImmediateLike(true);
      setImmediateDislike(false);
      const removeRes = await fetch(
        `${env.NEXT_PUBLIC_DOMAIN}/api/database/comment-reactions/remove/downVote`,
        { method: "POST", body: JSON.stringify(data) }
      );
      const addRes = await fetch(
        `${env.NEXT_PUBLIC_DOMAIN}/api/database/comment-reactions/add/upVote`,
        { method: "POST", body: JSON.stringify(data) }
      );

      const resData = await addRes.json();
      setReactions(resData.commentReactions);
      setPointFeedbackOffset(0);
      setImmediateDislike(false);
      setImmediateLike(false);
    } else {
      setPointFeedbackOffset(1);
      setImmediateLike(true);
      const addRes = await fetch(
        `${env.NEXT_PUBLIC_DOMAIN}/api/database/comment-reactions/add/upVote`,
        { method: "POST", body: JSON.stringify(data) }
      );
      const resData = await addRes.json();
      setReactions(resData.commentReactions);
      setPointFeedbackOffset(0);
      setImmediateDislike(false);
      setImmediateLike(false);
    }
  };
  const downVoteHandler = async () => {
    const data = {
      comment_id: props.comment.id,
      user_id: Cookies.get("userIDToken"),
    };

    if (
      reactions
        .filter((commentReaction) => commentReaction.type == "downVote")
        .some((commentReaction) => commentReaction.user_id == props.userID)
    ) {
      setPointFeedbackOffset(1);
      setImmediateDislike(false);
      const removeRes = await fetch(
        `${env.NEXT_PUBLIC_DOMAIN}/api/database/comment-reactions/remove/downVote`,
        { method: "POST", body: JSON.stringify(data) }
      );
      const resData = await removeRes.json();
      setReactions(resData.commentReactions);
      setPointFeedbackOffset(0);
      setImmediateDislike(false);
      setImmediateLike(false);
    } else if (
      reactions
        .filter((commentReaction) => commentReaction.type == "upVote")
        .some((commentReaction) => commentReaction.user_id == props.userID)
    ) {
      setPointFeedbackOffset(-2);
      setImmediateDislike(false);
      setImmediateLike(true);
      const removeRes = await fetch(
        `${env.NEXT_PUBLIC_DOMAIN}/api/database/comment-reactions/remove/upVote`,
        { method: "POST", body: JSON.stringify(data) }
      );
      const addRes = await fetch(
        `${env.NEXT_PUBLIC_DOMAIN}/api/database/comment-reactions/add/downVote`,
        { method: "POST", body: JSON.stringify(data) }
      );

      const resData = await addRes.json();
      setReactions(resData.commentReactions);
      setPointFeedbackOffset(0);
      setImmediateDislike(false);
      setImmediateLike(false);
    } else {
      setPointFeedbackOffset(-1);
      setImmediateDislike(true);
      const addRes = await fetch(
        `${env.NEXT_PUBLIC_DOMAIN}/api/database/comment-reactions/add/downVote`,
        { method: "POST", body: JSON.stringify(data) }
      );
      const resData = await addRes.json();
      setReactions(resData.commentReactions);
      setPointFeedbackOffset(0);
      setImmediateDislike(false);
      setImmediateLike(false);
    }
  };

  const genericReactionHandler = async (
    event: React.MouseEvent,
    type: string
  ) => {
    event.stopPropagation();
    const data = {
      comment_id: props.comment.id,
      user_id: props.userID,
    };
    if (
      reactions.some(
        (reaction) => reaction.type == type && reaction.user_id == props.userID
      )
    ) {
      //user has given this reaction, need to remove
      const res = await fetch(
        `${env.NEXT_PUBLIC_DOMAIN}/api/database/comment-reactions/remove/${type}`,
        { method: "POST", body: JSON.stringify(data) }
      );
      const resData = await res.json();
      setReactions(resData.commentReactions);
    } else {
      //create new reaction
      const res = await fetch(
        `${env.NEXT_PUBLIC_DOMAIN}/api/database/comment-reactions/add/${type}`,
        { method: "POST", body: JSON.stringify(data) }
      );
      const resData = await res.json();
      setReactions(resData.commentReactions);
    }
  };

  return (
    <>
      <button
        onClick={collapseCommentToggle}
        className={!commentCollapsed ? "hidden" : "ml-5 w-full px-2"}
      >
        <div className="mr-2 h-6 border-l-2 border-black dark:border-white" />
      </button>
      <div className={commentCollapsed ? "hidden" : ""}>
        <div ref={containerRef} className="my-4 flex w-full">
          <div
            className="flex flex-col justify-between"
            style={{ height: toggleHeight }}
          >
            <button onClick={() => upVoteHandler()}>
              <div
                className={`h-5 w-5 ${
                  reactions
                    .filter(
                      (commentReaction) => commentReaction.type == "upVote"
                    )
                    .some(
                      (commentReaction) =>
                        commentReaction.user_id == props.userID
                    ) || immediateLike
                    ? "fill-emerald-500"
                    : "fill-black dark:fill-white hover:fill-emerald-500"
                }`}
              >
                <ThumbsUpEmoji />
              </div>
            </button>
            <div className="mx-auto">
              {reactions.filter(
                (commentReaction) => commentReaction.type == "upVote"
              ).length -
                reactions.filter(
                  (commentReaction) => commentReaction.type == "downVote"
                ).length +
                pointFeedbackOffset}
            </div>
            <button onClick={() => downVoteHandler()}>
              <div
                className={`h-5 w-5 rotate-180 ${
                  reactions
                    .filter(
                      (commentReaction) => commentReaction.type == "downVote"
                    )
                    .some(
                      (commentReaction) =>
                        commentReaction.user_id == props.userID
                    ) || immediateDislike
                    ? "fill-rose-500"
                    : "fill-black dark:fill-white hover:fill-rose-500"
                }`}
              >
                <ThumbsUpEmoji />
              </div>
            </button>
          </div>
          <button onClick={collapseCommentToggle} className="px-2 z-0">
            <div
              className="border-l-2 border-black dark:border-white"
              style={{ height: toggleHeight }}
            />
          </button>
          <div className="w-full" onClick={showingReactionOptionsToggle}>
            <div className="flex">{props.comment.body}</div>
            <div className="flex pl-2">
              {userData?.data.image ? (
                <Image
                  src={env.NEXT_PUBLIC_AWS_BUCKET_STRING + userData.data.image}
                  alt="userIcon"
                  className="h-6 w-6 rounded-full"
                />
              ) : (
                <UserDefaultImage strokeWidth={1} height={24} width={24} />
              )}
              <div className="px-1">{userData?.data.email}</div>

              <div className="px-1">
                <button
                  onClick={(event) => toggleCommentReplyBox(event)}
                  className="z-50 absolute"
                >
                  <ReplyIcon
                    color={
                      pathname.split("/")[1] == "blog" ? "#fb923c" : "#60a5fa"
                    }
                    height={24}
                    width={24}
                  />
                </button>
              </div>
            </div>
            {props.userID == props.comment.commenter_id ? <div></div> : null}
            <div
              className={`${
                showingReactionOptions || reactions.length > 0
                  ? ""
                  : "opacity-0"
              }`}
            >
              <ReactionBar
                commentID={props.comment.id}
                currentUserID={props.userID}
                genericReactionHandler={genericReactionHandler}
                reactions={reactions}
                showingReactionOptions={showingReactionOptions}
              />
            </div>
          </div>
        </div>
        <div
          className={`${
            replyBoxShowing ? "fade-in" : "hidden"
          } opacity-0 lg:w-2/3`}
          ref={commentInputRef}
          style={{ marginLeft: `${-96 * props.recursionCount}px` }}
        >
          <CommentInputBlock
            isReply={true}
            privilegeLevel={props.privilegeLevel}
            commentRefreshTrigger={props.commentRefreshTrigger}
            parent_id={props.comment.id}
            type={props.category}
            post_id={props.projectID}
          />
        </div>
        <div className="pl-16">
          {props.child_comments.map((this_comment) => (
            <CommentBlock
              key={this_comment.id}
              comment={this_comment}
              category={props.category}
              projectID={props.projectID}
              recursionCount={1}
              allComments={props.allComments}
              child_comments={props.allComments.filter(
                (comment) => comment.parent_comment_id == this_comment.id
              )}
              privilegeLevel={props.privilegeLevel}
              userID={props.userID}
              commentRefreshTrigger={props.commentRefreshTrigger}
              reactionMap={props.reactionMap}
            />
          ))}
        </div>
      </div>
    </>
  );
}
