import { RefObject } from "react";

export default function CommentInputBlock(props: {
  isReply: boolean;
  privilegeLevel: "admin" | "user" | "anonymous";
}) {
  const submitComment = () => {};

  if (props.privilegeLevel == ("user" || "admin")) {
    return (
      <div className="flex w-full justify-center pt-8">
        <div className="w-3/4 md:w-1/2">
          <form onSubmit={submitComment}>
            <div className="textarea-group">
              <textarea
                required
                name="message"
                placeholder=" "
                className="bg-transparent underlinedInput w-full "
                rows={4}
              />
              <span className="bar" />
              <label className="underlinedInputLabel">{`Enter your ${
                props.isReply ? "reply" : "message"
              }`}</label>
            </div>
            <div className="flex justify-end py-4">
              <button
                type="submit"
                className="rounded border text-white shadow-md border-blue-500 bg-blue-400 hover:bg-blue-500 dark: dark:bg-blue-700 dark:hover:bg-blue-800 dark:border-blue-700 active:scale-90 transition-all duration-300 ease-in-out px-4 py-2"
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
      <div className="flex w-full justify-center pt-8">
        <div className="textarea-group">
          <textarea
            required
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
