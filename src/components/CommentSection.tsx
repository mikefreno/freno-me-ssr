import CommentInputBlock from "@/components/CommentInputBlock";
import CommentBlock from "@/components/CommentBlock";
import { Comment, CommentReaction } from "@/types/model-types";
import { MutableRefObject, useEffect, useState } from "react";

type UserCommentMapType = Map<
  {
    email?: string;
    display_name?: string;
    image?: string;
  },
  number[]
>;

export default function CommentSection(props: {
  privilegeLevel: "admin" | "user" | "anonymous";
  allComments: Comment[] | undefined;
  topLevelComments: Comment[] | undefined;
  id: number;
  type: "blog" | "project";
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
  updateComment: (body: string, comment_id: number) => Promise<void>;
  toggleDeletePrompt: (
    commentID: number,
    commenterID: string,
    commentBody: string,
    commenterImage?: string,
    commenterEmail?: string,
    commenterDisplayName?: string,
  ) => void;
  commentSubmitLoading: boolean;
}) {
  const { socket } = props;
  //state
  const [userCommentMap, setUserCommentMap] = useState<
    UserCommentMapType | undefined
  >(props.userCommentMap);
  const [clickedOnce, setClickedOnce] = useState<boolean>(false);
  const [showingBlock, setShowingBlock] = useState<Map<number, boolean>>(
    new Map(props.topLevelComments?.map((comment) => [comment.id, true])),
  );

  useEffect(() => {
    setUserCommentMap(props.userCommentMap);
  }, [props.userCommentMap]);

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
            type={props.type}
            post_id={props.id}
            socket={socket}
            currentUserID={props.currentUserID}
            newComment={props.newComment}
            commentSubmitLoading={props.commentSubmitLoading}
          />
        </div>

        <div className="" id="comments">
          {props.topLevelComments?.map((topLevelComment) => (
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
                  allComments={props.allComments}
                  child_comments={props.allComments?.filter(
                    (comment) =>
                      comment.parent_comment_id == topLevelComment.id,
                  )}
                  privilegeLevel={props.privilegeLevel}
                  currentUserID={props.currentUserID}
                  reactionMap={props.reactionMap}
                  level={0}
                  socket={socket}
                  userCommentMap={userCommentMap}
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
