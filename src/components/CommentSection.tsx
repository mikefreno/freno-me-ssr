"use client";

import CommentInputBlock from "@/components/CommentInputBlock";
import CommentBlock from "@/components/CommentBlock";
import { Comment, CommentReaction } from "@/types/model-types";
import { useEffect, useRef, useState } from "react";
import { env } from "@/env.mjs";
import useOnClickOutside from "@/hooks/ClickOutsideHook";

export default function CommentSection(props: {
  privilegeLevel: "admin" | "user" | "anonymous";
  allComments: Comment[];
  topLevelComments: Comment[];
  id: number;
  type: "blog" | "project";
  reactionMap: Map<number, CommentReaction[]>;
  currentUserID: string;
}) {
  const [comments, setComments] = useState<Comment[]>(props.allComments);
  const [topLevelComments, setTopLevelComments] = useState<Comment[]>(
    props.topLevelComments
  );
  const [clickedOnce, setClickedOnce] = useState<boolean>(false);
  const [showingBlock, setShowingBlock] = useState<Map<number, boolean>>(
    new Map(topLevelComments.map((comment) => [comment.id, true]))
  );

  const commentRefreshTrigger = async () => {
    const res = await fetch(
      `${env.NEXT_PUBLIC_DOMAIN}/api/database/comments/get-all/${props.type}/${props.id}`
    );
    const resData = await res.json();
    if (resData.status == 302) {
      setComments(resData.comments);
    }
  };

  useEffect(() => {
    const newTopLevelComments = comments.filter(
      (comment) => comment.parent_comment_id == null
    );
    setTopLevelComments(newTopLevelComments);
  }, [comments]);

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

  return (
    <div className="w-full">
      <div
        className="text-center text-2xl font-light tracking-widest underline underline-offset-8"
        id="comments"
      >
        Comments
      </div>
      <div>
        <CommentInputBlock
          isReply={false}
          privilegeLevel={props.privilegeLevel}
          commentRefreshTrigger={commentRefreshTrigger}
          parent_id={null}
          type={props.type}
          post_id={props.id}
        />
      </div>
      <div className="" id="comments">
        {topLevelComments?.map((topLevelComment) => (
          <div
            onClick={() => checkForDoubleClick(topLevelComment.id)}
            key={topLevelComment.id}
            className="bg-white select-none dark:bg-zinc-900 rounded shadow mt-4 pl-2 sm:pl-6 md:pl-12 lg:pl-16 max-w-full py-2"
          >
            {showingBlock.get(topLevelComment.id) ? (
              <CommentBlock
                comment={topLevelComment}
                category={"blog"}
                projectID={props.id}
                recursionCount={1}
                allComments={comments}
                child_comments={props.allComments.filter(
                  (comment) => comment.parent_comment_id == topLevelComment.id
                )}
                privilegeLevel={props.privilegeLevel}
                userID={props.currentUserID}
                commentRefreshTrigger={commentRefreshTrigger}
                reactionMap={props.reactionMap}
                level={0}
              />
            ) : (
              <div className="h-4"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
