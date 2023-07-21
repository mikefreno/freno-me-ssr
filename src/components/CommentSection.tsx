"use client";

import CommentInputBlock from "@/components/CommentInputBlock";
import CommentBlock from "@/components/CommentBlock";
import { Comment, CommentReaction } from "@/types/model-types";
import { useState } from "react";
import { env } from "@/env.mjs";

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

  const commentRefreshTrigger = async () => {
    const res = await fetch(
      `${env.NEXT_PUBLIC_DOMAIN}/api/database/comments/get-all/${props.type}/${props.id}`
    );
    const resData = await res.json();
    if (resData.status == 302) {
      setComments(resData.comments);
    }
  };

  return (
    <div className="px-6 sm:px-10 md:px-12 lg:px-16">
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
      <div className="pl-16" id="comments">
        {topLevelComments?.map((topLevelComment) => (
          <CommentBlock
            key={topLevelComment.id}
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
          />
        ))}
      </div>
    </div>
  );
}
