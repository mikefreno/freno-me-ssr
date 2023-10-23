import Xmark from "@/icons/Xmark";
import { RefObject } from "react";

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
  if (props.commenterID == props.currentUserID) {
    return (
      <div className="flex justify-center">
        <div
          ref={props.modificationPromptRef}
          className="fixed top-48 z-50 h-fit w-11/12 sm:w-4/5 md:w-2/3"
        >
          <div
            id="edit_prompt"
            className="fade-in rounded-md bg-zinc-600 px-8 py-4 shadow-lg dark:bg-zinc-800"
          >
            <button className="absolute right-4 " onClick={props.toggle}>
              <Xmark strokeWidth={0.5} color={"white"} height={50} width={50} />
            </button>
            <div className="py-4 text-center text-3xl tracking-wide text-zinc-50">
              Edit Comment
            </div>
          </div>
        </div>
      </div>
    );
  }
}
