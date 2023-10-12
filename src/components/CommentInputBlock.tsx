"use client";

import { useRef, useState } from "react";

export default function CommentInputBlock(props: {
  isReply: boolean;
  parent_id: number | null;
  privilegeLevel: "admin" | "user" | "anonymous";
  commentRefreshTrigger: () => Promise<void>;
  type: "project" | "blog";
  post_id: number;
  newComment: (
    body: string,
    parent_comment_id: number | undefined,
  ) => Promise<void>;
}) {
  const bodyRef = useRef<HTMLTextAreaElement>(null);
  const [buttonLoading, setButtonLoading] = useState<boolean>(false);

  //const submitComment = async (e: React.FormEvent) => {
  //e.preventDefault();
  //if (bodyRef.current) {
  //const res = await fetch(
  //`${env.NEXT_PUBLIC_DOMAIN}/api/database/comments/create/${props.type}/${props.post_id}`,
  //{
  //method: "POST",
  //body: JSON.stringify({
  //body: bodyRef.current.value,
  //parent_comment_id: props.parent_id,
  //commenter_id: Cookies.get("userIDToken"),
  //}),
  //}
  //);
  //console.log(await res.json());
  //}
  //props.commentRefreshTrigger();
  //};

  const submitCommentWrapper = (e: React.FormEvent) => {
    e.preventDefault();
    setButtonLoading(true);
    const submitComment = async () => {
      if (bodyRef.current) {
        await props.newComment(
          bodyRef.current.value,
          props.parent_id ? props.parent_id : undefined,
        );
      }
    };
    submitComment();
    setButtonLoading(false);
  };

  if (props.privilegeLevel == "user" || props.privilegeLevel == "admin") {
    return (
      <div className="flex w-full justify-center select-none">
        <div className="w-3/4 md:w-1/2 h-fit">
          <form onSubmit={submitCommentWrapper}>
            <div
              className={`textarea-group  ${
                props.type == "blog" ? "blog" : ""
              }`}
            >
              <textarea
                ref={bodyRef}
                required
                name="message"
                placeholder=" "
                className="bg-transparent underlinedInput w-full select-text"
                rows={props.isReply ? 2 : 4}
              />
              <span className="bar" />
              <label className="underlinedInputLabel">{`Enter your ${
                props.isReply ? "reply" : "message"
              }`}</label>
            </div>
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className={`${
                  buttonLoading
                    ? "bg-zinc-400"
                    : props.type == "project"
                    ? "border-blue-500 bg-blue-400 hover:bg-blue-500 dark:bg-blue-700 dark:hover:bg-blue-800 dark:border-blue-700"
                    : "border-orange-500 bg-orange-400 hover:bg-orange-500"
                } rounded border text-white shadow-md  active:scale-90 transition-all duration-300 ease-in-out px-4 py-2`}
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  } else {
    return (
      <div className="flex w-full justify-center">
        <div className={`textarea-group ${props.type == "blog" ? "blog" : ""}`}>
          <textarea
            required
            disabled
            name="message"
            placeholder=" "
            className="bg-transparent underlinedInput w-full "
            rows={4}
          />
          <span className="bar" />
          <label className="underlinedInputLabel">{`You must be logged in to ${
            props.isReply ? "reply" : "comment"
          }`}</label>
        </div>
      </div>
    );
  }
}
