import UserDefaultImage from "@/icons/UserDefaultImage";
import React, {
  FormEvent,
  MutableRefObject,
  useEffect,
  useRef,
  useState,
} from "react";
import ReplyIcon from "@/icons/ReplyIcon";
import CommentInputBlock from "./CommentInputBlock";
import ReactionBar from "./ReactionBar";
import ThumbsUpEmoji from "@/icons/emojis/ThumbsUp.svg";
import { Comment, CommentReaction } from "@/types/model-types";
import Image from "next/image";
import { usePathname } from "next/navigation";
import debounce from "./Debounce";
import TrashIcon from "@/icons/TrashIcon";
import LoadingSpinner from "./LoadingSpinner";
import EditIcon from "@/icons/EditIcon";

export default function CommentBlock(props: {
  comment: Comment;
  category: "project" | "blog";
  projectID: number;
  recursionCount: number;
  allComments: Comment[] | undefined;
  child_comments: Comment[] | undefined;
  privilegeLevel: "admin" | "user" | "anonymous";
  currentUserID: string;
  reactionMap: Map<number, CommentReaction[]>;
  level: number;
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
  commentSubmitLoading: boolean;
  toggleModification: (
    commentID: number,
    commenterID: string,
    commentBody: string,
    modificationType: "delete" | "edit",
    commenterImage?: string,
    commenterEmail?: string,
    commenterDisplayName?: string,
  ) => void;
  commentReaction: (
    event: FormEvent,
    reactionType: string,
    commentID: number,
  ) => void;
}) {
  const [commentCollapsed, setCommentCollapsed] = useState<boolean>(false);
  const [showingReactionOptions, setShowingReactionOptions] =
    useState<boolean>(false);
  const [replyBoxShowing, setReplyBoxShowing] = useState<boolean>(false);
  const [toggleHeight, setToggleHeight] = useState<number>(0);
  const [reactions, setReactions] = useState<CommentReaction[]>([]);
  const [windowWidth, setWindowWidth] = useState<number>(0);
  const [deletionLoading, setDeletionLoading] = useState<boolean>(false);
  const [userData, setUserData] = useState<{
    email?: string | undefined;
    display_name?: string | undefined;
    image?: string | undefined;
  } | null>(null);

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
    if (props.userCommentMap) {
      props.userCommentMap.forEach((v, k) => {
        if (v.includes(props.comment.id)) {
          setUserData(k);
        }
      });
    }
  }, [props.comment.id, props.userCommentMap]);

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
    //setTimeout(() => {
    //if (commentInputRef.current) {
    //commentInputRef.current.scrollIntoView({ behavior: "smooth" });
    //}
    //}, 50);
  };

  const deleteCommentTrigger = async (e: FormEvent) => {
    e.stopPropagation();
    setDeletionLoading(true);
    props.toggleModification(
      props.comment.id,
      props.comment.commenter_id,
      props.comment.body,
      "delete",
      userData?.image,
      userData?.email,
      userData?.display_name,
    );
    setDeletionLoading(false);
  };

  const editCommentTrigger = (e: FormEvent) => {
    e.stopPropagation();
    props.toggleModification(
      props.comment.id,
      props.comment.commenter_id,
      props.comment.body,
      "edit",
      userData?.image,
      userData?.email,
      userData?.display_name,
    );
  };

  return (
    <>
      <button
        onClick={collapseCommentToggle}
        className={!commentCollapsed ? "hidden" : "ml-5 w-full px-2 lg:w-3/4"}
      >
        <div className="my-auto mr-2 mt-1 h-8 border-l-2 border-black dark:border-white" />
      </button>
      <div
        className={`${
          commentCollapsed ? "hidden" : "z-[500]"
        } transition-all duration-300 ease-in-out`}
      >
        <div className="my-4 flex w-full overflow-x-hidden overflow-y-hidden lg:w-3/4">
          <div
            className="flex flex-col justify-between"
            style={{ height: toggleHeight }}
          >
            <button
              onClick={(e) =>
                props.commentReaction(e, "upVote", props.comment.id)
              }
            >
              <div
                className={`h-5 w-5 ${
                  reactions
                    .filter(
                      (commentReaction) => commentReaction.type == "upVote",
                    )
                    .some(
                      (commentReaction) =>
                        commentReaction.user_id == props.currentUserID,
                    )
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
                  <div className="tooltip-text -ml-16 w-32 text-white">
                    You must be logged in
                  </div>
                ) : null}
              </div>
            </button>
            <div className="mx-auto">
              {reactions.filter(
                (commentReaction) => commentReaction.type == "upVote",
              ).length -
                reactions.filter(
                  (commentReaction) => commentReaction.type == "downVote",
                ).length}
            </div>
            <button
              onClick={(e) =>
                props.commentReaction(e, "downVote", props.comment.id)
              }
            >
              <div
                className={`h-5 w-5 ${
                  reactions
                    .filter(
                      (commentReaction) => commentReaction.type == "downVote",
                    )
                    .some(
                      (commentReaction) =>
                        commentReaction.user_id == props.currentUserID,
                    )
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
                  <div className="tooltip-text -ml-16 w-32">
                    You must be logged in
                  </div>
                ) : null}
              </div>
            </button>
          </div>
          <button onClick={collapseCommentToggle} className="z-0 px-2">
            <div
              className="border-l-2 border-black transition-all duration-300 ease-in-out dark:border-white"
              style={{ height: toggleHeight }}
            />
          </button>
          <div
            className="w-3/4"
            onClick={showingReactionOptionsToggle}
            id={props.comment.id.toString()}
          >
            <div
              ref={containerRef}
              className="select-text overflow-x-hidden overflow-y-hidden"
            >
              <div className="max-w-[90%] md:max-w-[75%]">
                {props.comment.body}
              </div>
              {props.comment.edited ? (
                <div className="pb-0.5 text-xs italic">Edited</div>
              ) : null}
            </div>
            <div className="flex pl-2">
              {userData?.image ? (
                <Image
                  src={userData.image}
                  height={24}
                  width={24}
                  alt="user-image"
                  className="h-6 w-6 rounded-full object-cover object-center"
                />
              ) : (
                <UserDefaultImage strokeWidth={1} height={24} width={24} />
              )}
              <div className="px-1">
                {userData?.display_name
                  ? userData?.display_name
                  : userData?.email
                  ? userData.email
                  : "[removed]"}
              </div>
              <div>
                {props.currentUserID == props.comment.commenter_id ||
                props.privilegeLevel == "admin" ? (
                  <button onClick={(e) => deleteCommentTrigger(e)}>
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
            </div>
            <div className="absolute flex">
              {props.currentUserID == props.comment.commenter_id ? (
                <button onClick={editCommentTrigger} className="px-2">
                  <EditIcon strokeWidth={1} height={24} width={24} />
                </button>
              ) : null}
              <button
                onClick={(event) => toggleCommentReplyBox(event)}
                className="z-30"
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
            <div
              className={`${
                showingReactionOptions || reactions.length > 0
                  ? ""
                  : "opacity-0"
              } ml-16`}
            >
              <ReactionBar
                commentID={props.comment.id}
                currentUserID={props.currentUserID}
                reactions={reactions}
                showingReactionOptions={showingReactionOptions}
                privilegeLevel={props.privilegeLevel}
                commentReaction={props.commentReaction}
              />
            </div>
          </div>
        </div>
        <div
          className={`${
            replyBoxShowing ? "fade-in" : "hidden"
          } opacity-0 lg:w-2/3`}
          ref={commentInputRef}
          style={{ marginLeft: `${-24 * props.recursionCount}px` }}
        >
          <CommentInputBlock
            isReply={true}
            privilegeLevel={props.privilegeLevel}
            parent_id={props.comment.id}
            type={props.category}
            post_id={props.projectID}
            currentUserID={props.currentUserID}
            socket={props.socket}
            newComment={props.newComment}
            commentSubmitLoading={props.commentSubmitLoading}
          />
        </div>
        <div className="pl-2 sm:pl-4 md:pl-8 lg:pl-12">
          {props.child_comments?.map((this_comment) => (
            <CommentBlock
              key={this_comment.id}
              comment={this_comment}
              category={props.category}
              projectID={props.projectID}
              recursionCount={1}
              allComments={props.allComments}
              child_comments={props.allComments?.filter(
                (comment) => comment.parent_comment_id == this_comment.id,
              )}
              privilegeLevel={props.privilegeLevel}
              currentUserID={props.currentUserID}
              reactionMap={props.reactionMap}
              level={props.level + 1}
              socket={props.socket}
              userCommentMap={props.userCommentMap}
              toggleModification={props.toggleModification}
              newComment={props.newComment}
              commentSubmitLoading={props.commentSubmitLoading}
              commentReaction={props.commentReaction}
            />
          ))}
        </div>
      </div>
    </>
  );
}
