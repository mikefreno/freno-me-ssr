"use client";

import { env } from "@/env.mjs";
import { CommentReaction, Comment } from "@/types/model-types";
import { useEffect, useRef, useState } from "react";
import CommentSection from "./CommentSection";
import useOnClickOutside from "@/hooks/ClickOutsideHook";
import CommentDeletionPrompt from "./CommentDeletionPrompt";

const MAX_RETRIES = 12;
const RETRY_INTERVAL = 5000;

interface websocket_broadcast {
  action: "commentCreation" | "commentUpdate" | "commentDeletion";
  comment_body: string;
  comment_id: number;
  commenter_id: string;
  comment_parent?: number;
}
interface backup_res {
  comment_body: string;
  comment_id: number;
  commenter_id: string;
  comment_parent?: number;
}

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
  //state
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
  let socket = useRef<WebSocket | null>(null);

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
        socket.current = null;
        setTimeout(connect, RETRY_INTERVAL);
      };

      newSocket.onmessage = (messageEvent) => {
        try {
          const parsed = JSON.parse(messageEvent.data);
          switch (parsed.action) {
            case "commentCreation":
              createCommentHandler(parsed);
              break;
            case "commentUpdate":
              updateCommentHandler(parsed);
              break;
            case "commentDeletion":
              deleteCommentHandler(parsed);
              break;
            default:
              console.log(parsed);
          }
        } catch (e) {
          console.error(e);
        }
      };

      socket.current = newSocket;
    };
    connect();
    return () => {
      if (socket.current && socket.current.readyState == WebSocket.OPEN) {
        socket.current.close();
        socket.current = null;
      }
    };
  });

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

  // new comment handling
  async function newComment(commentBody: string, parentCommentID?: number) {
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
          comment_body: commentBody,
          comment_id: id,
          commenter_id: props.currentUserID,
          comment_parent: parentCommentID,
        });
      }
    }
  }

  async function createCommentHandler(data: websocket_broadcast | backup_res) {
    console.log(data);
    const body = data.comment_body;
    const commenterID = data.commenter_id;
    const parentCommentID = data.comment_parent;
    const id = data.comment_id;
    const res = await fetch(
      `${env.NEXT_PUBLIC_DOMAIN}/api/database/user/public-data/${id}`,
    );
    const userData = await res.json();
    console.log(userData);
    //const comment =
    setCommentSubmitLoading(false);
  }

  // update comment handling
  const updateComment = async (body: string, comment_id: number) => {
    if (socket.current) {
      socket.current.send(
        JSON.stringify({
          action: "updateComment",
          commentType: "update",
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

  function updateCommentHandler(data: websocket_broadcast) {}

  function toggleDeletePrompt(
    commentID: number,
    commenterID: string,
    commentBody: string,
    commenterImage?: string,
    commenterEmail?: string,
    commenterDisplayName?: string,
  ) {
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
  }

  function clearDeletionPompt() {
    setCommentIDForDeletePrompt(-1);
    setCommenterForDeletePrompt("");
    setCommenterImageForDeletePrompt(undefined);
    setCommenterEmailForDeletePrompt("");
    setCommenterDisplayNameForDeletePrompt(undefined);
    setCommentBodyForDeletePrompt("");
  }

  function deleteCommentHandler(data: websocket_broadcast) {}

  //reaction handling
  const commentReaction = () => {};

  return (
    <>
      <CommentSection
        privilegeLevel={props.privilegeLevel}
        allComments={props.allComments}
        topLevelComments={props.topLevelComments}
        id={props.id}
        type={props.type}
        reactionMap={props.reactionMap}
        currentUserID={props.currentUserID}
        socket={socket}
        userCommentMap={props.userCommentMap}
        newComment={newComment}
        commentSubmitLoading={commentSubmitLoading}
        toggleDeletePrompt={toggleDeletePrompt}
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
        />
      ) : null}
    </>
  );
}
