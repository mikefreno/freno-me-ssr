"use client";

import CommentInputBlock from "@/components/CommentInputBlock";
import CommentBlock from "@/components/CommentBlock";
import { Comment, CommentReaction } from "@/types/model-types";
import { useEffect, useRef, useState } from "react";
import { env } from "@/env.mjs";
import { usePathname } from "next/navigation";

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
    props.topLevelComments,
  );
  const [clickedOnce, setClickedOnce] = useState<boolean>(false);
  const [showingBlock, setShowingBlock] = useState<Map<number, boolean>>(
    new Map(topLevelComments.map((comment) => [comment.id, true])),
  );
  const [updateCounter, setUpdateCounter] = useState<number>(0);
  let socket = useRef<WebSocket | null>(null);

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

  const pathname = usePathname();
  //socket top level mgmt
  useEffect(() => {
    //no ws create a new one
    if (!socket.current) {
      const newSocket = new WebSocket(env.NEXT_PUBLIC_WEBSOCKET);
      socket.current = newSocket;
    }
    if (socket.current) {
      socket.current.onopen = () => {
        console.log("Socket opened");
        updateChannel();
      };
      socket.current.onclose = () => {
        console.log("socket closed");
        if (socket.current?.readyState !== WebSocket.OPEN) {
          socket.current = null;
        }
      };
      socket.current.onmessage = (messageEvent) => {
        console.log("message recieved");
        const handleMessage = async () => {
          console.log("message data: ", messageEvent.data);
          await commentRefreshTrigger();
        };
        handleMessage();
      };
      socket.current.onerror = (errorEvent) => {
        console.error("WebSocket Error: ", errorEvent);
      };
    }
    //return () => {
    //socket.current?.close();
    //socket.current = null;
    //};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const updateChannel = () => {
    if (socket.current?.readyState == WebSocket.OPEN) {
      console.log("channelUpdate firing");
      socket.current?.send(
        JSON.stringify({
          postType: props.type,
          blog_id: props.type == "blog" ? props.id : undefined,
          project_id: props.type == "project" ? props.id : undefined,
          invoker_id: props.currentUserID,
        }),
      );
    }
  };
  //socket channel mgmt
  useEffect(() => {
    updateChannel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, props.currentUserID, props.id, props.type, socket.current]);

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

  const checkForDoubleClick = (id: number) => {
    if (clickedOnce) {
      setShowingBlock((prev) => new Map(prev).set(id, !prev.get(id)));
    } else {
      setClickedOnce(true);
    }
  };

  const newComment = async (body: string, parent_comment_id?: number) => {
    //send to websocket
    if (socket.current?.OPEN) {
      console.log("sending via websocket");
      socket.current.send(
        JSON.stringify({
          action: "createComment",
          commentType: "create",
          commentBody: body,
          postType: props.type,
          blog_id: props.type == "blog" ? props.id : undefined,
          project_id: props.type == "project" ? props.id : undefined,
          parent_comment_id: parent_comment_id,
          invoker_id: props.currentUserID,
        }),
      );
    } else {
      // fallback
      const res = await fetch(
        `${env.NEXT_PUBLIC_DOMAIN}/api/database/comments/create/${props.type}/${props.id}`,
        {
          method: "POST",
          body: JSON.stringify({
            body: body,
            parent_comment_id: parent_comment_id,
            commenter_id: props.currentUserID,
          }),
        },
      );
      await commentRefreshTrigger();
      //console.log(await res.json());
    }
  };

  const updateComment = async (body: string, comment_id: number) => {
    if (socket.current) {
      socket.current.send(
        JSON.stringify({
          action: "updateComment",
          messageType: "comment",
          commentType: "update",
          commentBody: body,
          postType: props.type,
          blog_id: props.type == "blog" ? props.id : undefined,
          project_id: props.type == "project" ? props.id : undefined,
          comment_id: comment_id,
          invoker_id: props.currentUserID,
        }),
      );
    } else {
      //fallback
      const res = await fetch(
        `${env.NEXT_PUBLIC_DOMAIN}/api/database/comments/update`,
        {
          method: "POST",
          body: JSON.stringify({ body: body, comment_id: comment_id }),
        },
      );
      commentRefreshTrigger();
      console.log(await res.json());
    }
  };

  const commentReaction = () => {};

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
          newComment={newComment}
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
                  (comment) => comment.parent_comment_id == topLevelComment.id,
                )}
                privilegeLevel={props.privilegeLevel}
                userID={props.currentUserID}
                commentRefreshTrigger={commentRefreshTrigger}
                reactionMap={props.reactionMap}
                newComment={newComment}
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
