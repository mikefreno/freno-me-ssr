"use client";

import UserDefaultImage from "@/icons/UserDefaultImage";
import React, { useEffect, useRef, useState } from "react";
import ReplyIcon from "@/icons/ReplyIcon";
import CommentInputBlock from "./CommentInputBlock";
import ReactionBar from "./ReactionBar";
import ThumbsUpEmoji from "@/icons/emojis/ThumbsUp.svg";
import { Comment, CommentReaction } from "@/types/model-types";
import useSWR from "swr";
import { env } from "@/env.mjs";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Cookies from "js-cookie";
import { API_RES_GetUserDataFromCookie } from "@/types/response-types";
import debounce from "./Debounce";
import TrashIcon from "@/icons/TrashIcon";
import LoadingSpinner from "./LoadingSpinner";
import { deleteCommentByAdmin, deleteCommentByUser } from "@/app/globalActions";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  const data = (await res.json()) as API_RES_GetUserDataFromCookie;

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
  level: number;
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
  const [reactions, setReactions] = useState<CommentReaction[]>([]);
  const [pointFeedbackOffset, setPointFeedbackOffset] = useState<number>(0);
  const [immediateLike, setImmediateLike] = useState<boolean>(false);
  const [immediateDislike, setImmediateDislike] = useState<boolean>(false);
  const [windowWidth, setWindowWidth] = useState(0);
  const [deletionLoading, setDeletionLoading] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const commentInputRef = useRef<HTMLDivElement>(null);

  const pathname = usePathname();

  useEffect(() => {
    setCommentCollapsed(props.level >= 4 ? true : false);
  }, [props.level]);

  useEffect(() => {
    const handleResize = debounce(() => {
      setWindowWidth(window.innerWidth);
    }, 200);

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      const correction = showingReactionOptions ? 80 : 48;
      setToggleHeight(containerRef.current.clientHeight + correction);
    }
  }, [containerRef, showingReactionOptions, windowWidth]);

  useEffect(() => {
    setReactions(props.reactionMap.get(props.comment.id) || []);
  }, [props.comment, props.reactionMap]);

  const collapseCommentToggle = (event: React.MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();
    setCommentCollapsed(!commentCollapsed);
  };

  const showingReactionOptionsToggle = (event: React.MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();
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

  const upVoteHandler = async (event: React.MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();
    if (props.privilegeLevel !== "anonymous") {
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
    }
  };
  const downVoteHandler = async (event: React.MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();
    if (props.privilegeLevel !== "anonymous") {
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
    }
  };

  const genericReactionHandler = async (
    event: React.MouseEvent,
    type: string
  ) => {
    event.stopPropagation();
    if (props.privilegeLevel !== "anonymous") {
      const data = {
        comment_id: props.comment.id,
        user_id: props.userID,
      };
      if (
        reactions.some(
          (reaction) =>
            reaction.type == type && reaction.user_id == props.userID
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
    }
  };

  const deleteCommentTrigger = async () => {
    const affirm = window.confirm("Are you sure you want to delete?");
    if (affirm) {
      setDeletionLoading(true);
      if (props.userID == props.comment.commenter_id) {
        const res = await deleteCommentByUser({ commentID: props.comment.id });
      } else if (props.privilegeLevel == "admin") {
        const res = await deleteCommentByAdmin({ commentID: props.comment.id });
      }
      setDeletionLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={collapseCommentToggle}
        className={!commentCollapsed ? "hidden" : "ml-5 w-full lg:w-3/4 px-2"}
      >
        <div className="mr-2 h-8 border-l-2 mt-1 border-black dark:border-white my-auto" />
      </button>
      <div className={commentCollapsed ? "hidden" : "z-[500]"}>
        <div className="my-4 flex w-full lg:w-3/4 overflow-x-auto overflow-y-hidden">
          <div
            className="flex flex-col justify-between"
            style={{ height: toggleHeight }}
          >
            <div className="absolute -ml-6 -mt-1">
              {props.userID == props.comment.commenter_id ||
              props.privilegeLevel == "admin" ? (
                <button onClick={deleteCommentTrigger}>
                  {deletionLoading ? (
                    <LoadingSpinner height={24} width={24} />
                  ) : (
                    <TrashIcon
                      height={24}
                      width={24}
                      stroke={"red"}
                      strokeWidth={1.5}
                    />
                  )}
                </button>
              ) : null}
            </div>
            <button onClick={(e) => upVoteHandler(e)}>
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
                    : `fill-black dark:fill-white hover:fill-emerald-500 ${
                        props.privilegeLevel == "anonymous"
                          ? "tooltip z-50"
                          : null
                      }`
                }`}
              >
                <ThumbsUpEmoji />
                {props.privilegeLevel == "anonymous" ? (
                  <div className="tooltip-text w-32 -ml-16 text-white">
                    You must be logged in
                  </div>
                ) : null}
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
            <button onClick={(e) => downVoteHandler(e)}>
              <div
                className={`h-5 w-5 ${
                  reactions
                    .filter(
                      (commentReaction) => commentReaction.type == "downVote"
                    )
                    .some(
                      (commentReaction) =>
                        commentReaction.user_id == props.userID
                    ) || immediateDislike
                    ? "fill-rose-500"
                    : `fill-black dark:fill-white hover:fill-rose-500 ${
                        props.privilegeLevel == "anonymous"
                          ? "tooltip z-50"
                          : null
                      }`
                }`}
              >
                <div className="rotate-180">
                  <ThumbsUpEmoji />
                </div>
                {props.privilegeLevel == "anonymous" ? (
                  <div className="tooltip-text w-32 -ml-16">
                    You must be logged in
                  </div>
                ) : null}
              </div>
            </button>
          </div>
          <button onClick={collapseCommentToggle} className="px-2 z-0">
            <div
              className="border-l-2 border-black dark:border-white transition-all duration-300 ease-in-out"
              style={{ height: toggleHeight }}
            />
          </button>
          <div className="w-3/4" onClick={showingReactionOptionsToggle}>
            <div
              ref={containerRef}
              className="flex select-text overflow-x-auto overflow-y-hidden"
            >
              {props.comment.body}
            </div>
            <div className="flex pl-2">
              {userData?.data.image ? (
                <Image
                  src={userData.data.image}
                  height={24}
                  width={24}
                  alt="user-image"
                  className="rounded-full w-6 h-6 object-cover object-center"
                />
              ) : (
                <UserDefaultImage strokeWidth={1} height={24} width={24} />
              )}
              <div className="px-1">
                {userData?.data.displayName
                  ? userData?.data.displayName
                  : userData?.data.email}
              </div>
            </div>
            {props.userID == props.comment.commenter_id ? <div></div> : null}
            <button
              onClick={(event) => toggleCommentReplyBox(event)}
              className="z-30 absolute"
            >
              <ReplyIcon
                color={pathname.split("/")[1] == "blog" ? "#fb923c" : "#60a5fa"}
                height={24}
                width={24}
              />
            </button>
            <div
              className={`${
                showingReactionOptions || reactions.length > 0
                  ? ""
                  : "opacity-0"
              } ml-6`}
            >
              <ReactionBar
                commentID={props.comment.id}
                currentUserID={props.userID}
                genericReactionHandler={genericReactionHandler}
                reactions={reactions}
                showingReactionOptions={showingReactionOptions}
                privilegeLevel={props.privilegeLevel}
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
        <div className="pl-2 sm:pl-6 md:pl-12 lg:pl-16">
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
              level={props.level + 1}
            />
          ))}
        </div>
      </div>
    </>
  );
}
