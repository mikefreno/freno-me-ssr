"use client";

import { env } from "@/env.mjs";
import { CommentReaction, Comment } from "@/types/model-types";
import { useEffect, useRef, useState } from "react";
import CommentSection from "./CommentSection";
import { backup_res, websocket_broadcast } from "@/types/utility-types";
import CommentDeletionPrompt from "./CommentDeletionPrompt";
import useOnClickOutside from "@/hooks/ClickOutsideHook";

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
  const [showingDeletionPrompt, setShowingDeletionPrompt] =
    useState<boolean>(false);
  const [commentIDForDeletePrompt, setCommentIDForDeletePrompt] =
    useState<number>(-1);
  const [commenterForDeletePrompt, setCommenterForDeletePrompt] =
    useState<string>("");
  const [commenterImageForDeletePrompt, setCommenterImageForDeletePrompt] =
    useState<string>();
  const [commenterEmailForDeletePrompt, setCommenterEmailForDeletePrompt] =
    useState<string>();
  const [
    commenterDisplaNameForDeletePrompt,
    setCommenterDisplayNameForDeletePrompt,
  ] = useState<string>();
  const [commentBodyForDeletePrompt, setCommentBodyForDeletePrompt] =
    useState<string>("");
  //refs
  const deletePromptRef = useRef<HTMLDivElement>(null);
  let retryCount = useRef<number>(0);
  let socket = useRef<WebSocket>();

  //hooks
  useOnClickOutside([deletePromptRef], () => {
    setShowingDeletionPrompt(false);
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
              updateCommentHandler(parsed);
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
    const newComment = {
      id: id,
      body: body,
      blog_id: props.type == "blog" ? props.id : undefined,
      project_id: props.type == "project" ? props.id : undefined,
      parent_comment_id: parentCommentID,
      commenter_id: commenterID,
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

  //comment updating
  const updateComment = async (body: string, comment_id: number) => {
    if (socket.current) {
      socket.current.send(
        JSON.stringify({
          action: "updateComment",
          commentBody: body,
          postType: props.type,
          postID: props.id,
          commentID: comment_id,
          invokerID: props.currentUserID,
        }),
      );
    } else {
      //fallback
      await fetch(`${env.NEXT_PUBLIC_DOMAIN}/api/database/comments/update`, {
        method: "POST",
        body: JSON.stringify({ body: body, commentID: comment_id }),
      });
    }
  };

  const updateCommentHandler = (data: websocket_broadcast) => {};

  //comment deletion
  const deleteComment = (checkedChoice: string) => {
    setCommentDeletionLoading(true);
    if (socket) {
      socket.current?.send(
        JSON.stringify({
          action: "commentDeletion",
          deleteType: checkedChoice,
          commentID: commentIDForDeletePrompt,
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
      clearDeletionPompt();
      setShowingDeletionPrompt(false);
    }, 500);
  };

  //deletion prompt
  const toggleDeletePrompt = (
    commentID: number,
    commenterID: string,
    commentBody: string,
    commenterImage?: string,
    commenterEmail?: string,
    commenterDisplayName?: string,
  ) => {
    if (commentID == commentIDForDeletePrompt) {
      setShowingDeletionPrompt(false);
      clearDeletionPompt();
    } else {
      setShowingDeletionPrompt(true);
      setCommentIDForDeletePrompt(commentID);
      setCommenterForDeletePrompt(commenterID);
      setCommenterImageForDeletePrompt(commenterImage);
      setCommenterEmailForDeletePrompt(commenterEmail);
      setCommenterDisplayNameForDeletePrompt(commenterDisplayName);
      setCommentBodyForDeletePrompt(commentBody);
    }
  };

  const clearDeletionPompt = () => {
    setCommentIDForDeletePrompt(-1);
    setCommenterForDeletePrompt("");
    setCommenterImageForDeletePrompt(undefined);
    setCommenterEmailForDeletePrompt("");
    setCommenterDisplayNameForDeletePrompt(undefined);
    setCommentBodyForDeletePrompt("");
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
        updateComment={updateComment}
        toggleDeletePrompt={toggleDeletePrompt}
        commentSubmitLoading={commentSubmitLoading}
      />
      {showingDeletionPrompt ? (
        <CommentDeletionPrompt
          commentID={commentIDForDeletePrompt}
          commenterID={commenterForDeletePrompt}
          currentUserID={props.currentUserID}
          commenterImage={commenterImageForDeletePrompt}
          commenterEmail={commenterEmailForDeletePrompt}
          commenterDisplayName={commenterDisplaNameForDeletePrompt}
          commentBody={commentBodyForDeletePrompt}
          privilegeLevel={props.privilegeLevel}
          deletePromptRef={deletePromptRef}
          postType={props.type}
          postID={props.id}
          commentDeletionLoading={commentDeletionLoading}
          deleteComment={deleteComment}
        />
      ) : null}
    </>
  );
}
