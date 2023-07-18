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
}) {
  return (
    <div className="pl-6 fade-in flex flex-row">
      <div className="mx-1 flex">
        <div
          className={`${
            props.reactions.some(
              (reaction) =>
                reaction.type == "tears" &&
                reaction.user_id == props.currentUserID
            )
              ? "text-green-500"
              : null
          }`}
        >
          {
            props.reactions.filter((reaction) => reaction.type == "tears")
              .length
          }
        </div>
        <button
          className="pl-0.5 h-6 w-6"
          onClick={(event) => props.genericReactionHandler(event, "tears")}
        >
          <TearsEmoji />
        </button>
      </div>
      <div className="mx-1 flex">
        <div
          className={`${
            props.reactions.some(
              (reaction) =>
                reaction.type == "blank" &&
                reaction.user_id == props.currentUserID
            )
              ? "text-green-500"
              : null
          }`}
        >
          {
            props.reactions.filter((reaction) => reaction.type == "blank")
              .length
          }
        </div>
        <button
          className="mx-1 h-6 w-6"
          onClick={(event) => props.genericReactionHandler(event, "blank")}
        >
          <BlankEmoji />
        </button>
      </div>
      <div className="mx-1 flex">
        <div
          className={`${
            props.reactions.some(
              (reaction) =>
                reaction.type == "cry" &&
                reaction.user_id == props.currentUserID
            )
              ? "text-green-500"
              : null
          }`}
        >
          {props.reactions.filter((reaction) => reaction.type == "cry").length}
        </div>
        <button
          className="mx-1 h-6 w-6"
          onClick={(event) => props.genericReactionHandler(event, "cry")}
        >
          <CryEmoji />
        </button>
      </div>
      <div className="mx-1 flex">
        <div
          className={`${
            props.reactions.some(
              (reaction) =>
                reaction.type == "heartEye" &&
                reaction.user_id == props.currentUserID
            )
              ? "text-green-500"
              : null
          }`}
        >
          {
            props.reactions.filter((reaction) => reaction.type == "heartEye")
              .length
          }
        </div>
        <button
          className="mx-1 h-6 w-6"
          onClick={(event) => props.genericReactionHandler(event, "heartEye")}
        >
          <HeartEyeEmoji />
        </button>
      </div>
      <div className="mx-1 flex">
        <div
          className={`${
            props.reactions.some(
              (reaction) =>
                reaction.type == "angry" &&
                reaction.user_id == props.currentUserID
            )
              ? "text-green-500"
              : null
          }`}
        >
          {
            props.reactions.filter((reaction) => reaction.type == "angry")
              .length
          }
        </div>
        <button
          className="mx-1 h-6 w-6"
          onClick={(event) => props.genericReactionHandler(event, "angry")}
        >
          <AngryEmoji />
        </button>
      </div>
      <div className="mx-1 flex">
        <div
          className={`${
            props.reactions.some(
              (reaction) =>
                reaction.type == "moneyEye" &&
                reaction.user_id == props.currentUserID
            )
              ? "text-green-500"
              : null
          }`}
        >
          {
            props.reactions.filter((reaction) => reaction.type == "moneyEye")
              .length
          }
        </div>
        <button
          className="mx-1 h-6 w-6"
          onClick={(event) => props.genericReactionHandler(event, "moneyEye")}
        >
          <MoneyEyeEmoji />
        </button>
      </div>
      <div className="mx-1 flex">
        <div
          className={`${
            props.reactions.some(
              (reaction) =>
                reaction.type == "sick" &&
                reaction.user_id == props.currentUserID
            )
              ? "text-green-500"
              : null
          }`}
        >
          {props.reactions.filter((reaction) => reaction.type == "sick").length}
        </div>
        <button
          className="mx-1 h-6 w-6"
          onClick={(event) => props.genericReactionHandler(event, "sick")}
        >
          <SickEmoji />
        </button>
      </div>
      <div className="mx-1 flex">
        <div
          className={`${
            props.reactions.some(
              (reaction) =>
                reaction.type == "upsideDown" &&
                reaction.user_id == props.currentUserID
            )
              ? "text-green-500"
              : null
          }`}
        >
          {
            props.reactions.filter((reaction) => reaction.type == "upsideDown")
              .length
          }
        </div>
        <button
          className="mx-1 h-6 w-6"
          onClick={(event) => props.genericReactionHandler(event, "upsideDown")}
        >
          <UpsideDownEmoji />
        </button>
      </div>
      <div className="mx-1 flex">
        <div
          className={`${
            props.reactions.some(
              (reaction) =>
                reaction.type == "worried" &&
                reaction.user_id == props.currentUserID
            )
              ? "text-green-500"
              : null
          }`}
        >
          {
            props.reactions.filter((reaction) => reaction.type == "worried")
              .length
          }
        </div>
        <button
          className="mx-1 h-6 w-6"
          onClick={(event) => props.genericReactionHandler(event, "worried")}
        >
          <WorriedEmoji />
        </button>
      </div>
    </div>
  );
}
