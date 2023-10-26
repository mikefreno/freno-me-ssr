import AngryEmoji from "@/icons/emojis/Angry.svg";
import BlankEmoji from "@/icons/emojis/Blank.svg";
import CryEmoji from "@/icons/emojis/Cry.svg";
import HeartEyeEmoji from "@/icons/emojis/HeartEye.svg";
import MoneyEyeEmoji from "@/icons/emojis/MoneyEye.svg";
import SickEmoji from "@/icons/emojis/Sick.svg";
import TearsEmoji from "@/icons/emojis/Tears.svg";
import TongueEmoji from "@/icons/emojis/Tongue.svg";
import UpsideDownEmoji from "@/icons/emojis/UpsideDown.svg";
import WorriedEmoji from "@/icons/emojis/Worried.svg";
import { CommentReaction } from "@/types/model-types";

export default function ReactionBar(props: {
  currentUserID: string;
  commentID: number;
  genericReactionHandler: (event: React.MouseEvent, type: string) => void;
  reactions: CommentReaction[];
  privilegeLevel: "admin" | "user" | "anonymous";
  showingReactionOptions: boolean;
}) {
  return (
    <div
      className={`${
        props.showingReactionOptions
          ? "bg-zinc-50 px-2 py-4 shadow-inner dark:bg-zinc-700"
          : ""
      } ml-2 py-1 min-h-[1.5rem] w-48 sm:w-56 fade-in flex rounded-md flex-row max-w-[1/4] overflow-scroll scrollYDisabled md:overflow-hidden md:w-fit`}
    >
      <div
        className={`${
          props.showingReactionOptions ||
          props.reactions.filter((reaction) => reaction.type == "tears")
            .length > 0
            ? "fade-in"
            : "hidden"
        } mx-1 flex`}
      >
        <div
          className={`${
            props.reactions.some(
              (reaction) =>
                reaction.type == "tears" &&
                reaction.user_id == props.currentUserID,
            )
              ? "text-green-500"
              : null
          }`}
        >
          {props.reactions.filter((reaction) => reaction.type == "tears")
            .length > 0
            ? props.reactions.filter((reaction) => reaction.type == "tears")
                .length
            : null}
        </div>
        <button
          className={`pl-0.5 h-6 w-6`}
          onClick={(event) => props.genericReactionHandler(event, "tears")}
        >
          <TearsEmoji />
        </button>
      </div>
      <div
        className={`${
          props.showingReactionOptions ||
          props.reactions.filter((reaction) => reaction.type == "blank")
            .length > 0
            ? "fade-in"
            : "hidden"
        } mx-1 flex`}
      >
        <div
          className={`${
            props.reactions.some(
              (reaction) =>
                reaction.type == "blank" &&
                reaction.user_id == props.currentUserID,
            )
              ? "text-green-500"
              : null
          }`}
        >
          {props.reactions.filter((reaction) => reaction.type == "blank")
            .length > 0
            ? props.reactions.filter((reaction) => reaction.type == "blank")
                .length
            : null}
        </div>
        <button
          className={`pl-0.5 h-6 w-6`}
          onClick={(event) => props.genericReactionHandler(event, "blank")}
        >
          <BlankEmoji />
        </button>
      </div>
      <div
        className={`${
          props.showingReactionOptions ||
          props.reactions.filter((reaction) => reaction.type == "tongue")
            .length > 0
            ? "fade-in"
            : "hidden"
        } mx-1 flex`}
      >
        <div
          className={`${
            props.reactions.some(
              (reaction) =>
                reaction.type == "tongue" &&
                reaction.user_id == props.currentUserID,
            )
              ? "text-green-500"
              : null
          }`}
        >
          {props.reactions.filter((reaction) => reaction.type == "tongue")
            .length > 0
            ? props.reactions.filter((reaction) => reaction.type == "tongue")
                .length
            : null}
        </div>
        <button
          className={`pl-0.5 h-6 w-6`}
          onClick={(event) => props.genericReactionHandler(event, "tongue")}
        >
          <TongueEmoji />
        </button>
      </div>
      <div
        className={`${
          props.showingReactionOptions ||
          props.reactions.filter((reaction) => reaction.type == "cry").length >
            0
            ? "fade-in"
            : "hidden"
        } mx-1 flex`}
      >
        <div
          className={`${
            props.reactions.some(
              (reaction) =>
                reaction.type == "cry" &&
                reaction.user_id == props.currentUserID,
            )
              ? "text-green-500"
              : null
          }`}
        >
          {props.reactions.filter((reaction) => reaction.type == "cry").length >
          0
            ? props.reactions.filter((reaction) => reaction.type == "cry")
                .length
            : null}
        </div>
        <button
          className={`pl-0.5 h-6 w-6`}
          onClick={(event) => props.genericReactionHandler(event, "cry")}
        >
          <CryEmoji />
        </button>
      </div>
      <div
        className={`${
          props.showingReactionOptions ||
          props.reactions.filter((reaction) => reaction.type == "heartEye")
            .length > 0
            ? "fade-in"
            : "hidden"
        } mx-1 flex`}
      >
        <div
          className={`${
            props.reactions.some(
              (reaction) =>
                reaction.type == "heartEye" &&
                reaction.user_id == props.currentUserID,
            )
              ? "text-green-500"
              : null
          }`}
        >
          {props.reactions.filter((reaction) => reaction.type == "heartEye")
            .length > 0
            ? props.reactions.filter((reaction) => reaction.type == "heartEye")
                .length
            : null}
        </div>
        <button
          className={`pl-0.5 h-6 w-6`}
          onClick={(event) => props.genericReactionHandler(event, "heartEye")}
        >
          <HeartEyeEmoji />
        </button>
      </div>
      <div
        className={`${
          props.showingReactionOptions ||
          props.reactions.filter((reaction) => reaction.type == "angry")
            .length > 0
            ? "fade-in"
            : "hidden"
        } mx-1 flex`}
      >
        <div
          className={`${
            props.reactions.some(
              (reaction) =>
                reaction.type == "angry" &&
                reaction.user_id == props.currentUserID,
            )
              ? "text-green-500"
              : null
          }`}
        >
          {props.reactions.filter((reaction) => reaction.type == "angry")
            .length > 0
            ? props.reactions.filter((reaction) => reaction.type == "angry")
                .length
            : null}
        </div>
        <button
          className={`pl-0.5 h-6 w-6`}
          onClick={(event) => props.genericReactionHandler(event, "angry")}
        >
          <AngryEmoji />
        </button>
      </div>
      <div
        className={`${
          props.showingReactionOptions ||
          props.reactions.filter((reaction) => reaction.type == "moneyEye")
            .length > 0
            ? "fade-in"
            : "hidden"
        } mx-1 flex`}
      >
        <div
          className={`${
            props.reactions.some(
              (reaction) =>
                reaction.type == "moneyEye" &&
                reaction.user_id == props.currentUserID,
            )
              ? "text-green-500"
              : null
          }`}
        >
          {props.reactions.filter((reaction) => reaction.type == "moneyEye")
            .length > 0
            ? props.reactions.filter((reaction) => reaction.type == "moneyEye")
                .length
            : null}
        </div>
        <button
          className={`pl-0.5 h-6 w-6`}
          onClick={(event) => props.genericReactionHandler(event, "moneyEye")}
        >
          <MoneyEyeEmoji />
        </button>
      </div>
      <div
        className={`${
          props.showingReactionOptions ||
          props.reactions.filter((reaction) => reaction.type == "sick").length >
            0
            ? "fade-in"
            : "hidden"
        } mx-1 flex`}
      >
        <div
          className={`${
            props.reactions.some(
              (reaction) =>
                reaction.type == "sick" &&
                reaction.user_id == props.currentUserID,
            )
              ? "text-green-500"
              : null
          }`}
        >
          {props.reactions.filter((reaction) => reaction.type == "sick")
            .length > 0
            ? props.reactions.filter((reaction) => reaction.type == "sick")
                .length
            : null}
        </div>
        <button
          className={`pl-0.5 h-6 w-6`}
          onClick={(event) => props.genericReactionHandler(event, "sick")}
        >
          <SickEmoji />
        </button>
      </div>
      <div
        className={`${
          props.showingReactionOptions ||
          props.reactions.filter((reaction) => reaction.type == "upsideDown")
            .length > 0
            ? "fade-in"
            : "hidden"
        } mx-1 flex`}
      >
        <div
          className={`${
            props.reactions.some(
              (reaction) =>
                reaction.type == "upsideDown" &&
                reaction.user_id == props.currentUserID,
            )
              ? "text-green-500"
              : null
          }`}
        >
          {props.reactions.filter((reaction) => reaction.type == "upsideDown")
            .length > 0
            ? props.reactions.filter(
                (reaction) => reaction.type == "upsideDown",
              ).length
            : null}
        </div>
        <button
          className={`pl-0.5 h-6 w-6`}
          onClick={(event) => props.genericReactionHandler(event, "upsideDown")}
        >
          <UpsideDownEmoji />
        </button>
      </div>
      <div
        className={`${
          props.showingReactionOptions ||
          props.reactions.filter((reaction) => reaction.type == "worried")
            .length > 0
            ? "fade-in"
            : "hidden"
        } mx-1 flex`}
      >
        <div
          className={`${
            props.reactions.some(
              (reaction) =>
                reaction.type == "worried" &&
                reaction.user_id == props.currentUserID,
            )
              ? "text-green-500"
              : null
          }`}
        >
          {props.reactions.filter((reaction) => reaction.type == "worried")
            .length > 0
            ? props.reactions.filter((reaction) => reaction.type == "worried")
                .length
            : null}
        </div>
        <button
          className={`pl-0.5 h-6 w-6`}
          onClick={(event) => props.genericReactionHandler(event, "worried")}
        >
          <WorriedEmoji />
        </button>
      </div>
    </div>
  );
}
