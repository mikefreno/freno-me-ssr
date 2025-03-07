import { RefObject, useState } from "react";
import Image from "next/image";
import UserDefaultImage from "@/icons/UserDefaultImage";
import Xmark from "@/icons/Xmark";

export default function CommentDeletionPrompt(props: {
  commentID: number;
  commenterID: string;
  currentUserID: string;
  commenterImage?: string;
  commenterEmail?: string;
  commenterDisplayName?: string;
  commentBody: string;
  privilegeLevel: "admin" | "user" | "anonymous";
  deletePromptRef: RefObject<HTMLDivElement | null>;
  postType: "project" | "blog";
  postID: number;
  commentDeletionLoading: boolean;
  deleteComment: (checkedChoice: string) => void;
  toggle: () => void;
}) {
  const [normalDeleteChecked, setNormalDeleteChecked] = useState(false);
  const [adminDeleteChecked, setAdminDeleteChecked] = useState(false);
  const [fullDeleteChecked, setFullDeleteChecked] = useState(false);

  const handleNormalDeleteCheckbox = () => {
    setNormalDeleteChecked(!normalDeleteChecked);
    setFullDeleteChecked(false);
    setAdminDeleteChecked(false);
  };

  const handleAdminDeleteCheckbox = () => {
    setAdminDeleteChecked(!adminDeleteChecked);
    setFullDeleteChecked(false);
    setNormalDeleteChecked(false);
  };

  const handleFullDeleteCheckbox = () => {
    setFullDeleteChecked(!fullDeleteChecked);
    setNormalDeleteChecked(false);
    setAdminDeleteChecked(false);
  };

  const deletionWrapper = () => {
    let deleteType = "";
    if (normalDeleteChecked) {
      deleteType = "user";
    } else if (adminDeleteChecked) {
      deleteType = "admin";
    } else if (fullDeleteChecked) {
      deleteType = "full";
    }
    props.deleteComment(deleteType);
  };

  if (
    props.currentUserID == props.commenterID ||
    props.privilegeLevel == "admin"
  ) {
    return (
      <div className="flex justify-center">
        <div
          ref={props.deletePromptRef}
          className="fixed top-48 z-50 h-fit w-11/12 sm:w-4/5 md:w-2/3"
        >
          <div
            id="delete_prompt"
            className="fade-in rounded-md bg-red-400 px-8 py-4 shadow-lg dark:bg-red-900"
          >
            <button className="absolute right-4 " onClick={props.toggle}>
              <Xmark strokeWidth={0.5} color={"white"} height={50} width={50} />
            </button>
            <div className="py-4 text-center text-3xl tracking-wide">
              Comment Deletion
            </div>
            <div className="mx-auto w-3/4 rounded  bg-zinc-50 px-6 py-4 dark:bg-zinc-800">
              <div className="flex select-text overflow-x-auto overflow-y-hidden">
                {props.commentBody}
              </div>
              <div className="my-2 flex pl-2">
                {props.commenterImage ? (
                  <Image
                    src={props.commenterImage}
                    height={24}
                    width={24}
                    alt="user-image"
                    className="h-6 w-6 rounded-full object-cover object-center"
                  />
                ) : (
                  <UserDefaultImage strokeWidth={1} height={24} width={24} />
                )}
                <div className="px-1">
                  {props.commenterDisplayName
                    ? props.commenterDisplayName
                    : props.commenterEmail
                    ? props.commenterEmail
                    : "[removed]"}
                </div>
              </div>
            </div>
            <div className="flex w-full justify-center">
              <div className="flex pt-4">
                <input
                  type="checkbox"
                  className="my-auto"
                  checked={normalDeleteChecked}
                  onChange={handleNormalDeleteCheckbox}
                />
                <div className="my-auto px-2 text-sm font-normal">
                  {props.privilegeLevel == "admin"
                    ? "Confirm User Delete?"
                    : "Confirm Delete?"}
                </div>
              </div>
            </div>
            {props.privilegeLevel == "admin" ? (
              <>
                <div className="flex w-full justify-center">
                  <div className="flex pt-4">
                    <input
                      type="checkbox"
                      className="my-auto"
                      checked={adminDeleteChecked}
                      onChange={handleAdminDeleteCheckbox}
                    />
                    <div className="my-auto px-2 text-sm font-normal">
                      Confirm Admin Delete?
                    </div>
                  </div>
                </div>
                <div className="flex w-full justify-center">
                  <div className="flex pt-4">
                    <input
                      type="checkbox"
                      className="my-auto"
                      checked={fullDeleteChecked}
                      onChange={handleFullDeleteCheckbox}
                    />
                    <div className="my-auto px-2 text-sm font-normal">
                      Confirm Full Delete (removal from database)?
                    </div>
                  </div>
                </div>
              </>
            ) : null}
            <div className="flex w-full justify-center pt-2">
              <button
                type="button"
                onClick={deletionWrapper}
                disabled={
                  props.commentDeletionLoading ||
                  !(
                    normalDeleteChecked ||
                    adminDeleteChecked ||
                    fullDeleteChecked
                  )
                }
                className={`${
                  props.commentDeletionLoading ||
                  !(
                    normalDeleteChecked ||
                    adminDeleteChecked ||
                    fullDeleteChecked
                  )
                    ? "bg-zinc-400"
                    : "border-orange-500 bg-orange-400 hover:bg-orange-500"
                } rounded border text-white shadow-md active:scale-90 transition-all duration-300 ease-in-out px-4 py-2`}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
