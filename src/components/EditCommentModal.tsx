import Xmark from "@/icons/Xmark";
import { FormEvent, RefObject, useRef, useState } from "react";

export default function EditCommentModal(props: {
  commentID: number;
  commenterID: string;
  currentUserID: string;
  commenterImage?: string;
  commenterEmail?: string;
  commenterDisplayName?: string;
  commentBody: string;
  postID: number;
  editComment: (body: string, comment_id: number) => Promise<void>;
  editCommentLoading: boolean;
  modificationPromptRef: RefObject<HTMLDivElement>;
  toggle: () => void;
}) {
  let bodyRef = useRef<HTMLTextAreaElement>(null);
  const [showNoChange, setShowNoChange] = useState<boolean>(false);

  const editCommentWrapper = (e: FormEvent) => {
    e.preventDefault();
    if (
      bodyRef.current &&
      bodyRef.current.value.length > 0 &&
      bodyRef.current.value != props.commentBody
    ) {
      setShowNoChange(false);
      props.editComment(bodyRef.current.value, props.commentID);
    } else {
      setShowNoChange(true);
    }
  };

  if (props.commenterID == props.currentUserID) {
    return (
      <div className="flex justify-center">
        <div
          ref={props.modificationPromptRef}
          className="fixed top-48 h-fit w-11/12 sm:w-4/5 md:w-2/3"
        >
          <div
            id="edit_prompt"
            className="fade-in z-50 rounded-md bg-zinc-600 px-8 py-4 shadow-lg dark:bg-zinc-800"
          >
            <button className="absolute right-4 " onClick={props.toggle}>
              <Xmark strokeWidth={0.5} color={"white"} height={50} width={50} />
            </button>
            <div className="py-4 text-center text-3xl tracking-wide text-zinc-50">
              Edit Comment
            </div>
            <form onSubmit={(e) => editCommentWrapper(e)}>
              <div className="textarea-group home">
                <textarea
                  required
                  ref={bodyRef}
                  placeholder=" "
                  defaultValue={props.commentBody}
                  className="underlinedInput w-full bg-transparent text-blue-300"
                  rows={4}
                />
                <span className="bar" />
                <label className="underlinedInputLabel">Edit Comment</label>
              </div>
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={props.editCommentLoading}
                  className={`${
                    props.editCommentLoading ? "bg-zinc-400" : null
                  } rounded border text-white shadow-md hover:bg-blue-400 hover:border-blue-500 active:scale-90 transition-all duration-300 ease-in-out px-4 py-2`}
                >
                  Submit
                </button>
              </div>
            </form>
            {showNoChange ? (
              <div className="text-center italic text-red-500">
                No change detected
              </div>
            ) : null}
          </div>
        </div>
      </div>
    );
  }
}
