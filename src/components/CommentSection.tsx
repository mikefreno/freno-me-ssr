import CommentInputBlock from "@/components/CommentInputBlock";
import CommentBlock from "@/components/CommentBlock";
import { Comment, CommentReaction } from "@/types/model-types";
import { MutableRefObject, useEffect, useState } from "react";
import { env } from "@/env.mjs";
import CommentSortingSelect from "./CommentSortingSelect";

export default function CommentSection(props: {
  privilegeLevel: "admin" | "user" | "anonymous";
  allComments: Comment[];
  topLevelComments: Comment[];
  id: number;
  type: "blog" | "project";
  reactionMap: Map<number, CommentReaction[]>;
  currentUserID: string;
  socket: MutableRefObject<WebSocket | null>;
  userCommentMap: Map<
    {
      email?: string | undefined;
      display_name?: string | undefined;
      image?: string | undefined;
    },
    number[]
  >;
  newComment: (commentBody: string, parentCommentID?: number) => Promise<void>;
  commentSubmitLoading: boolean;
  toggleDeletePrompt: (
    commentID: number,
    commenterID: string,
    commentBody: string,
    commenterImage?: string,
    commenterEmail?: string,
    commenterDisplayName?: string,
  ) => void;
}) {
  const { socket } = props;
  const [comments, setComments] = useState<Comment[]>(props.allComments);
  const [topLevelComments, setTopLevelComments] = useState<Comment[]>(
    props.topLevelComments,
  );
  const [clickedOnce, setClickedOnce] = useState<boolean>(false);
  const [showingBlock, setShowingBlock] = useState<Map<number, boolean>>(
    new Map(topLevelComments.map((comment) => [comment.id, true])),
  );

  useEffect(() => {
    const newTopLevelComments = comments.filter(
      (comment) => comment.parent_comment_id == null,
    );
    setTopLevelComments(newTopLevelComments);
  }, [comments]);

  useEffect(() => {
    if (clickedOnce) {
      setTimeout(() => setClickedOnce(false), 300);
    }
  }, [clickedOnce]);

  const commentRefreshTrigger = async () => {
    const res = await fetch(
      `${env.NEXT_PUBLIC_DOMAIN}/api/database/comments/get-all/${props.type}/${props.id}`,
    );
    const resData = await res.json();
    //console.log(resData);
    if (res.status == 302) {
      setComments(resData.comments);
    }
  };

  const checkForDoubleClick = (id: number) => {
    if (clickedOnce) {
      setShowingBlock((prev) => new Map(prev).set(id, !prev.get(id)));
    } else {
      setClickedOnce(true);
    }
  };

  return (
    <>
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
            type={props.type}
            post_id={props.id}
            socket={socket}
            currentUserID={props.currentUserID}
            newComment={props.newComment}
            commentSubmitLoading={false}
          />
        </div>
        <CommentSortingSelect type={props.type} />
        <div className="" id="comments">
          {topLevelComments?.map((topLevelComment) => (
            <div
              onClick={() => checkForDoubleClick(topLevelComment.id)}
              key={topLevelComment.id}
              className="mt-4 max-w-full select-none rounded bg-white py-2 pl-2 shadow dark:bg-zinc-900 sm:pl-4 md:pl-8 lg:pl-12"
            >
              {showingBlock.get(topLevelComment.id) ? (
                <CommentBlock
                  comment={topLevelComment}
                  category={"blog"}
                  projectID={props.id}
                  recursionCount={1}
                  allComments={comments}
                  child_comments={props.allComments.filter(
                    (comment) =>
                      comment.parent_comment_id == topLevelComment.id,
                  )}
                  privilegeLevel={props.privilegeLevel}
                  currentUserID={props.currentUserID}
                  commentRefreshTrigger={commentRefreshTrigger}
                  reactionMap={props.reactionMap}
                  level={0}
                  socket={socket}
                  userCommentMap={props.userCommentMap}
                  toggleDeletePrompt={props.toggleDeletePrompt}
                  newComment={props.newComment}
                  commentSubmitLoading={props.commentSubmitLoading}
                />
              ) : (
                <div className="h-4"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
