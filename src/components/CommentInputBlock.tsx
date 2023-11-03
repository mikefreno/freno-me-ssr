import { FormEvent, MutableRefObject, useEffect, useRef } from "react";

export default function CommentInputBlock(props: {
  isReply: boolean;
  parent_id?: number;
  privilegeLevel: "admin" | "user" | "anonymous";
  type: "project" | "blog";
  post_id: number;
  socket: MutableRefObject<WebSocket | undefined>;
  currentUserID: string;
  newComment: (commentBody: string, parentCommentID?: number) => Promise<void>;
  commentSubmitLoading: boolean;
}) {
  const bodyRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.value = "";
    }
  }, [props.commentSubmitLoading]);

  function newCommentWrapper(e: FormEvent) {
    e.preventDefault();
    if (bodyRef.current && bodyRef.current.value.length > 0) {
      props.newComment(bodyRef.current.value, props.parent_id);
    }
  }

  if (props.privilegeLevel == "user" || props.privilegeLevel == "admin") {
    return (
      <div className="flex w-full select-none justify-center">
        <div className="h-fit w-3/4 md:w-1/2">
          <form onSubmit={(e) => newCommentWrapper(e)}>
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
                className="underlinedInput w-full select-text bg-transparent"
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
                disabled={props.commentSubmitLoading}
                className={`${
                  props.commentSubmitLoading
                    ? "bg-zinc-400"
                    : props.type == "project"
                    ? "border-blue-500 bg-blue-400 hover:bg-blue-500 dark:border-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
                    : "border-orange-500 bg-orange-400 hover:bg-orange-500"
                } rounded border text-white shadow-md  active:scale-90 transition-all font-light duration-300 ease-in-out px-4 py-2`}
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
            className="underlinedInput w-full bg-transparent "
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
