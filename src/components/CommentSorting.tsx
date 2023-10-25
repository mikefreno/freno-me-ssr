"use client";
import { Comment, CommentReaction } from "@/types/model-types";
import { MutableRefObject, useEffect, useState } from "react";
import CommentBlock from "./CommentBlock";

export default function CommentSorting(props: {
  topLevelComments: Comment[];
  privilegeLevel: "anonymous" | "admin" | "user";
  type: "blog" | "projects";
  postID: number;
  allComments: Comment[];
  reactionMap: Map<number, CommentReaction[]>;
  currentUserID: string;
  socket: MutableRefObject<WebSocket | undefined>;
  userCommentMap:
    | Map<
        {
          email?: string | undefined;
          display_name?: string | undefined;
          image?: string | undefined;
        },
        number[]
      >
    | undefined;
  newComment: (commentBody: string, parentCommentID?: number) => Promise<void>;
  editComment: (body: string, comment_id: number) => Promise<void>;
  toggleModification: (
    commentID: number,
    commenterID: string,
    commentBody: string,
    modificationType: "delete" | "edit",
    commenterImage?: string,
    commenterEmail?: string,
    commenterDisplayName?: string,
  ) => void;
  commentSubmitLoading: boolean;
  selectedSorting: {
    val: string;
  };
}) {
  const [clickedOnce, setClickedOnce] = useState<boolean>(false);
  const [showingBlock, setShowingBlock] = useState<Map<number, boolean>>(
    new Map(props.topLevelComments?.map((comment) => [comment.id, true])),
  );
  useEffect(() => {
    setShowingBlock(
      new Map(props.topLevelComments?.map((comment) => [comment.id, true])),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.topLevelComments]);

  useEffect(() => {
    if (clickedOnce) {
      setTimeout(() => setClickedOnce(false), 300);
    }
  }, [clickedOnce]);

  const checkForDoubleClick = (id: number) => {
    if (clickedOnce) {
      setShowingBlock((prev) => new Map(prev).set(id, !prev.get(id)));
    } else {
      setClickedOnce(true);
    }
  };

  switch (props.selectedSorting.val) {
    case "Newest":
      return [...props.topLevelComments]
        .sort((a, b) => {
          let dateA = new Date(a.date);
          let dateB = new Date(b.date);
          return dateB.getTime() - dateA.getTime();
        })
        .map((topLevelComment) => (
          <div
            onClick={() => checkForDoubleClick(topLevelComment.id)}
            key={topLevelComment.id}
            className="mt-4 max-w-full select-none rounded bg-white py-2 pl-2 shadow dark:bg-zinc-900 sm:pl-4 md:pl-8 lg:pl-12"
          >
            {showingBlock.get(topLevelComment.id) ? (
              <CommentBlock
                comment={topLevelComment}
                category={"blog"}
                projectID={props.postID}
                recursionCount={1}
                allComments={props.allComments}
                child_comments={props.allComments?.filter(
                  (comment) => comment.parent_comment_id == topLevelComment.id,
                )}
                privilegeLevel={props.privilegeLevel}
                currentUserID={props.currentUserID}
                reactionMap={props.reactionMap}
                level={0}
                socket={props.socket}
                userCommentMap={props.userCommentMap}
                toggleModification={props.toggleModification}
                newComment={props.newComment}
                commentSubmitLoading={props.commentSubmitLoading}
              />
            ) : (
              <div className="h-4"></div>
            )}
          </div>
        ));

    case "Oldest":
      return [...props.topLevelComments]
        .sort((a, b) => {
          let dateA = new Date(a.date);
          let dateB = new Date(b.date);
          return dateA.getTime() - dateB.getTime();
        })
        .map((topLevelComment) => (
          <div
            onClick={() => checkForDoubleClick(topLevelComment.id)}
            key={topLevelComment.id}
            className="mt-4 max-w-full select-none rounded bg-white py-2 pl-2 shadow dark:bg-zinc-900 sm:pl-4 md:pl-8 lg:pl-12"
          >
            {showingBlock.get(topLevelComment.id) ? (
              <CommentBlock
                comment={topLevelComment}
                category={"blog"}
                projectID={props.postID}
                recursionCount={1}
                allComments={props.allComments}
                child_comments={props.allComments?.filter(
                  (comment) => comment.parent_comment_id == topLevelComment.id,
                )}
                privilegeLevel={props.privilegeLevel}
                currentUserID={props.currentUserID}
                reactionMap={props.reactionMap}
                level={0}
                socket={props.socket}
                userCommentMap={props.userCommentMap}
                toggleModification={props.toggleModification}
                newComment={props.newComment}
                commentSubmitLoading={props.commentSubmitLoading}
              />
            ) : (
              <div className="h-4"></div>
            )}
          </div>
        ));

    case "Highest Rated":
      return [...props.topLevelComments]
        .sort((a, b) => {
          const aReactions = props.reactionMap.get(a.id) || [];
          const bReactions = props.reactionMap.get(b.id) || [];
          return bReactions.length - aReactions.length;
        })
        .map((topLevelComment) => (
          <div
            onClick={() => checkForDoubleClick(topLevelComment.id)}
            key={topLevelComment.id}
            className="mt-4 max-w-full select-none rounded bg-white py-2 pl-2 shadow dark:bg-zinc-900 sm:pl-4 md:pl-8 lg:pl-12"
          >
            {showingBlock.get(topLevelComment.id) ? (
              <CommentBlock
                comment={topLevelComment}
                category={"blog"}
                projectID={props.postID}
                recursionCount={1}
                allComments={props.allComments}
                child_comments={props.allComments?.filter(
                  (comment) => comment.parent_comment_id == topLevelComment.id,
                )}
                privilegeLevel={props.privilegeLevel}
                currentUserID={props.currentUserID}
                reactionMap={props.reactionMap}
                level={0}
                socket={props.socket}
                userCommentMap={props.userCommentMap}
                toggleModification={props.toggleModification}
                newComment={props.newComment}
                commentSubmitLoading={props.commentSubmitLoading}
              />
            ) : (
              <div className="h-4"></div>
            )}
          </div>
        ));

    case "Hot":
      return [...props.topLevelComments]
        .sort((a, b) => {
          const aReactions = props.reactionMap.get(a.id) || [];
          const bReactions = props.reactionMap.get(b.id) || [];
          return bReactions.length - aReactions.length;
        })
        .map((topLevelComment) => (
          <div
            onClick={() => checkForDoubleClick(topLevelComment.id)}
            key={topLevelComment.id}
            className="mt-4 max-w-full select-none rounded bg-white py-2 pl-2 shadow dark:bg-zinc-900 sm:pl-4 md:pl-8 lg:pl-12"
          >
            {showingBlock.get(topLevelComment.id) ? (
              <CommentBlock
                comment={topLevelComment}
                category={"blog"}
                projectID={props.postID}
                recursionCount={1}
                allComments={props.allComments}
                child_comments={props.allComments?.filter(
                  (comment) => comment.parent_comment_id == topLevelComment.id,
                )}
                privilegeLevel={props.privilegeLevel}
                currentUserID={props.currentUserID}
                reactionMap={props.reactionMap}
                level={0}
                socket={props.socket}
                userCommentMap={props.userCommentMap}
                toggleModification={props.toggleModification}
                newComment={props.newComment}
                commentSubmitLoading={props.commentSubmitLoading}
              />
            ) : (
              <div className="h-4"></div>
            )}
          </div>
        ));
  }
}
