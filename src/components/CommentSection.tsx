import CommentInputBlock from "@/components/CommentInputBlock";
import CommentBlock from "@/components/CommentBlock";
import { Comment, CommentReaction } from "@/types/model-types";
import { FormEvent, MutableRefObject, useEffect, useState } from "react";
import CommentSortingSelect from "./CommentSortingSelect";
import CommentSorting from "./CommentSorting";

type UserCommentMapType = Map<
  {
    email?: string;
    display_name?: string;
    image?: string;
  },
  number[]
>;
const commentSorting = [
  { val: "Newest" },
  { val: "Oldest" },
  { val: "Highest Rated" },
  { val: "Hot" },
];

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
  commentReaction: (
    event: FormEvent,
    reactionType: string,
    commentID: number,
  ) => void;
}) {
  const { socket } = props;
  //state
  const [userCommentMap, setUserCommentMap] = useState<
    UserCommentMapType | undefined
  >(props.userCommentMap);
  const [selectedSorting, setSelectedSorting] = useState(commentSorting[0]);

  useEffect(() => {
    setUserCommentMap(props.userCommentMap);
  }, [props.userCommentMap]);

  return (
    <>
      <div className="w-full">
        <div
          className="text-center text-2xl font-light tracking-widest underline underline-offset-8"
          id="comments"
        >
          Comments
        </div>
        <div className="mb-1">
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
        {props.allComments &&
        props.allComments.length > 0 &&
        props.topLevelComments &&
        props.topLevelComments.length > 0 ? (
          <>
            <CommentSortingSelect
              type={"blog"}
              commentSorting={commentSorting}
              selectedSorting={selectedSorting}
              setSelectedSorting={setSelectedSorting}
            />
            <div className="" id="comments">
              <CommentSorting
                topLevelComments={props.topLevelComments}
                privilegeLevel={"admin"}
                type={"blog"}
                postID={props.id}
                allComments={props.allComments}
                reactionMap={props.reactionMap}
                currentUserID={props.currentUserID}
                socket={socket}
                userCommentMap={userCommentMap}
                newComment={props.newComment}
                editComment={props.editComment}
                toggleModification={props.toggleModification}
                commentSubmitLoading={props.commentSubmitLoading}
                selectedSorting={selectedSorting}
                commentReaction={props.commentReaction}
              />
            </div>
          </>
        ) : (
          <div className="pt-8 text-center text-xl font-thin italic tracking-wide">
            No Comments Yet
          </div>
        )}
      </div>
    </>
  );
}
