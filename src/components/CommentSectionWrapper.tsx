"use client";

import { env } from "@/env.mjs";
import { CommentReaction, Comment } from "@/types/model-types";
import { useEffect, useRef, useState } from "react";
import CommentSection from "./CommentSection";
import { backup_res, websocket_broadcast } from "@/types/utility-types";
import CommentDeletionPrompt from "./CommentDeletionPrompt";
import useOnClickOutside from "@/hooks/ClickOutsideHook";
import EditCommentModal from "./EditCommentModal";

const MAX_RETRIES = 12;
const RETRY_INTERVAL = 5000;

type UserCommentMapType = Map<
  {
    email?: string;
    display_name?: string;
    image?: string;
  },
  number[]
>;

export default function CommentSectionWrapper(props: {
  privilegeLevel: "admin" | "user" | "anonymous";
  allComments: Comment[];
  topLevelComments: Comment[];
  id: number;
  type: "blog" | "project";
  reactionMap: Map<number, CommentReaction[]>;
  currentUserID: string;
  userCommentMap: Map<
    {
      email?: string | undefined;
      display_name?: string | undefined;
      image?: string | undefined;
    },
    number[]
  >;
}) {
  const [allComments, setAllComments] = useState<Comment[]>(props.allComments);
  const [topLevelComments, setTopLevelComments] = useState<Comment[]>(
    props.topLevelComments,
  );
  let userCommentMap = useRef<UserCommentMapType>(props.userCommentMap);
  const [commentSubmitLoading, setCommentSubmitLoading] =
    useState<boolean>(false);
  const [commentDeletionLoading, setCommentDeletionLoading] =
    useState<boolean>(false);
  const [editCommentLoading, setCommentEditLoading] = useState<boolean>(false);
  const [showingCommentEdit, setShowingCommentEdit] = useState<boolean>(false);
  const [showingDeletionPrompt, setShowingDeletionPrompt] =
    useState<boolean>(false);
  const [commentIDForModification, setCommentIDForModification] =
    useState<number>(-1);
  const [commenterForModification, setCommenterForModification] =
    useState<string>("");
  const [commenterImageForModification, setCommenterImageForModification] =
    useState<string>();
  const [commenterEmailForModification, setCommenterEmailForModification] =
    useState<string>();
  const [
    commenterDisplaNameForModification,
    setCommenterDisplayNameForModification,
  ] = useState<string>();
  const [commentBodyForModification, setCommentBodyForModification] =
    useState<string>("");

  //refs
  const modificationPromptRef = useRef<HTMLDivElement>(null);
  const deletePromptRef = useRef<HTMLDivElement>(null);
  let retryCount = useRef<number>(0);
  let socket = useRef<WebSocket>();

  //hooks
  useOnClickOutside([deletePromptRef], () => {
    setShowingDeletionPrompt(false);
    //setTimeout(() => {
    //clearModificationPrompt();
    //}, 500);
  });
  useOnClickOutside([modificationPromptRef], () => {
    setShowingCommentEdit(false);
    //setTimeout(() => {
    //clearModificationPrompt();
    //}, 500);
  });

  // websocket handling
  useEffect(() => {
    const connect = () => {
      if (socket.current) return;
      if (retryCount.current > MAX_RETRIES) {
        console.error("Max retries exceeded!");
        return;
      }

      const newSocket = new WebSocket(env.NEXT_PUBLIC_WEBSOCKET);

      newSocket.onopen = () => {
        updateChannel();
        retryCount.current = 0;
      };

      newSocket.onclose = () => {
        retryCount.current += 1;
        socket.current = undefined;
        setTimeout(connect, RETRY_INTERVAL);
      };

      newSocket.onmessage = (messageEvent) => {
        try {
          const parsed = JSON.parse(messageEvent.data);
          switch (parsed.action) {
            case "commentCreationBroadcast":
              createCommentHandler(parsed);
              break;
            case "commentUpdateBroadcast":
              editCommentHandler(parsed);
              break;
            case "commentDeletionBroadcast":
              deleteCommentHandler(parsed);
              break;
            default:
              //console.log(parsed.action);
              break;
          }
        } catch (e) {
          console.error(e);
        }
      };

      socket.current = newSocket;
    };
    connect();
  });

  useEffect(() => {
    return () => {
      // This cleanup function will run only when the component unmounts
      if (socket.current?.readyState === WebSocket.OPEN) {
        socket.current.close();
        socket.current = undefined;
      }
    };
  }, []);

  const updateChannel = () => {
    if (socket.current && socket.current.readyState == WebSocket.OPEN) {
      socket.current.send(
        JSON.stringify({
          action: "channelUpdate",
          postType: props.type,
          postID: props.id,
          invoker_id: props.currentUserID,
        }),
      );
    }
  };

  //comment creation
  const newComment = async (commentBody: string, parentCommentID?: number) => {
    setCommentSubmitLoading(true);
    if (commentBody && socket.current) {
      socket.current.send(
        JSON.stringify({
          action: "commentCreation",
          commentBody: commentBody,
          postType: props.type,
          postID: props.id,
          parentCommentID: parentCommentID,
          invokerID: props.currentUserID,
        }),
      );
    } else {
      // fallback
      const res = await fetch(
        `${env.NEXT_PUBLIC_DOMAIN}/api/database/comments/create/${props.type}/${props.id}`,
        {
          method: "POST",
          body: JSON.stringify({
            body: commentBody,
            parentCommentID: parentCommentID,
            commenterID: props.currentUserID,
          }),
        },
      );
      if (res.status == 201) {
        const id = (await res.json()).data;
        createCommentHandler({
          commentBody: commentBody,
          commentID: id,
          commenterID: props.currentUserID,
          commentParent: parentCommentID,
        });
      }
    }
  };

  const createCommentHandler = async (
    data: websocket_broadcast | backup_res,
  ) => {
    const body = data.commentBody;
    const commenterID = data.commenterID;
    const parentCommentID = data.commentParent;
    const id = data.commentID;
    const res = await fetch(
      `${env.NEXT_PUBLIC_DOMAIN}/api/database/user/public-data/${commenterID}`,
    );
    const userData = (await res.json()) as {
      email?: string;
      display_name?: string;
      image?: string;
    };
    const comment_date = getSQLMatchingFormattedDate();
    const newComment = {
      id: id,
      body: body,
      blog_id: props.type == "blog" ? props.id : undefined,
      project_id: props.type == "project" ? props.id : undefined,
      parent_comment_id: parentCommentID,
      commenter_id: commenterID,
      edited: false,
      date: comment_date,
    };
    if (parentCommentID == -1) {
      setTopLevelComments((prevComments) => [
        ...(prevComments || []),
        newComment,
      ]);
    }
    setAllComments((prevComments) => [...(prevComments || []), newComment]);

    if (userCommentMap.current?.has(userData) && userCommentMap.current) {
      const prevIDs = userCommentMap.current.get(userData);
      userCommentMap.current.set(userData, [...(prevIDs || []), id]);
    } else {
      userCommentMap.current?.set(userData, [id]);
    }
    setCommentSubmitLoading(false);
  };

  function getSQLMatchingFormattedDate() {
    const date = new Date();
    date.setHours(date.getHours() + 4);
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, "0");
    const day = `${date.getDate()}`.padStart(2, "0");
    const hours = `${date.getHours()}`.padStart(2, "0");
    const minutes = `${date.getMinutes()}`.padStart(2, "0");
    const seconds = `${date.getSeconds()}`.padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  //comment updating
  const editComment = async (body: string, comment_id: number) => {
    setCommentEditLoading(true);
    if (socket.current) {
      socket.current.send(
        JSON.stringify({
          action: "commentUpdate",
          commentBody: body,
          postType: props.type,
          postID: props.id,
          commentID: comment_id,
          invokerID: props.currentUserID,
        }),
      );
    }
  };

  const editCommentHandler = (data: websocket_broadcast) => {
    setAllComments((prev) =>
      prev.map((comment) => {
        if (comment.id === data.commentID) {
          return {
            ...comment,
            body: data.commentBody,
            edited: true,
          };
        }
        return comment;
      }),
    );
    setTopLevelComments((prev) =>
      prev.map((comment) => {
        if (comment.id === data.commentID) {
          return {
            ...comment,
            body: data.commentBody,
            edited: true,
          };
        }
        return comment;
      }),
    );
    setCommentEditLoading(true);
    setTimeout(() => {
      setShowingCommentEdit(false);
      clearModificationPrompt();
    }, 300);
  };

  //comment deletion
  const deleteComment = (checkedChoice: string) => {
    setCommentDeletionLoading(true);
    if (socket) {
      socket.current?.send(
        JSON.stringify({
          action: "commentDeletion",
          deleteType: checkedChoice,
          commentID: commentIDForModification,
          invokerID: props.currentUserID,
          postType: props.type,
          postID: props.id,
        }),
      );
    }
  };

  const deleteCommentHandler = (data: websocket_broadcast) => {
    if (data.commentBody) {
      setAllComments((prev) =>
        prev.map((comment) => {
          if (comment.id === data.commentID) {
            return {
              ...comment,
              body: data.commentBody,
              commenter_id: "",
              edited: false,
            };
          }
          return comment;
        }),
      );

      setTopLevelComments((prev) =>
        prev.map((comment) => {
          if (comment.id === data.commentID) {
            return {
              ...comment,
              body: data.commentBody,
              commenter_id: "",
              edited: false,
            };
          }
          return comment;
        }),
      );
    } else if (allComments && topLevelComments) {
      setAllComments((prev) =>
        prev.filter((comment) => comment.id !== data.commentID),
      );
      setTopLevelComments((prev) =>
        prev.filter((comment) => comment.id !== data.commentID),
      );
    }
    setCommentDeletionLoading(false);
    setTimeout(() => {
      clearModificationPrompt();
      setShowingDeletionPrompt(false);
    }, 300);
  };

  //deletion prompt
  const toggleModification = (
    commentID: number,
    commenterID: string,
    commentBody: string,
    modificationType: "delete" | "edit",
    commenterImage?: string,
    commenterEmail?: string,
    commenterDisplayName?: string,
  ) => {
    if (commentID == commentIDForModification) {
      if (modificationType == "delete") {
        setShowingDeletionPrompt(false);
      } else {
        setShowingCommentEdit(false);
      }
      clearModificationPrompt();
    } else {
      if (modificationType == "delete") {
        setShowingDeletionPrompt(true);
      } else {
        setShowingCommentEdit(true);
      }
      setCommentIDForModification(commentID);
      setCommenterForModification(commenterID);
      setCommenterImageForModification(commenterImage);
      setCommenterEmailForModification(commenterEmail);
      setCommenterDisplayNameForModification(commenterDisplayName);
      setCommentBodyForModification(commentBody);
    }
  };

  const clearModificationPrompt = () => {
    setCommentIDForModification(-1);
    setCommenterForModification("");
    setCommenterImageForModification(undefined);
    setCommenterEmailForModification("");
    setCommenterDisplayNameForModification(undefined);
    setCommentBodyForModification("");
  };

  //reaction handling
  const commentReaction = () => {};

  return (
    <>
      <CommentSection
        privilegeLevel={props.privilegeLevel}
        allComments={allComments}
        topLevelComments={topLevelComments}
        id={props.id}
        type={props.type}
        reactionMap={props.reactionMap}
        currentUserID={props.currentUserID}
        socket={socket}
        userCommentMap={userCommentMap.current}
        newComment={newComment}
        editComment={editComment}
        toggleModification={toggleModification}
        commentSubmitLoading={commentSubmitLoading}
      />
      {showingDeletionPrompt ? (
        <CommentDeletionPrompt
          commentID={commentIDForModification}
          commenterID={commenterForModification}
          currentUserID={props.currentUserID}
          commenterImage={commenterImageForModification}
          commenterEmail={commenterEmailForModification}
          commenterDisplayName={commenterDisplaNameForModification}
          commentBody={commentBodyForModification}
          privilegeLevel={props.privilegeLevel}
          deletePromptRef={deletePromptRef}
          postType={props.type}
          postID={props.id}
          commentDeletionLoading={commentDeletionLoading}
          deleteComment={deleteComment}
          toggle={() => {
            clearModificationPrompt();
            setShowingDeletionPrompt(false);
          }}
        />
      ) : null}
      {showingCommentEdit ? (
        <EditCommentModal
          commentID={commentIDForModification}
          commenterID={commenterForModification}
          currentUserID={props.currentUserID}
          commenterImage={commenterImageForModification}
          commenterEmail={commenterEmailForModification}
          commenterDisplayName={commenterDisplaNameForModification}
          commentBody={commentBodyForModification}
          postID={props.id}
          editCommentLoading={editCommentLoading}
          modificationPromptRef={modificationPromptRef}
          editComment={editComment}
          toggle={() => {
            clearModificationPrompt();
            setShowingCommentEdit(false);
          }}
        />
      ) : null}
    </>
  );
}
