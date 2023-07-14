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

export default function ReactionBar(props: {
  currentUser: User;
  commentID: number;
}) {
  const giveReaction = (reactionGiven: string, commentID: number) => {
    const data = {
      senderID: props.currentUser.id,
      commentID: props.commentID,
      reactionType: reactionGiven,
    };
  };

  return (
    <div>
      <button className="mx-1 h-6 w-6">
        <TearsEmoji />
      </button>
      <button className="mx-1 h-6 w-6">
        <BlankEmoji />
      </button>
      <button className="mx-1 h-6 w-6">
        <CryEmoji />
      </button>
      <button className="mx-1 h-6 w-6">
        <HeartEyeEmoji />
      </button>
      <button className="mx-1 h-6 w-6">
        <AngryEmoji />
      </button>
      <button className="mx-1 h-6 w-6">
        <MoneyEyeEmoji />
      </button>
      <button className="mx-1 h-6 w-6">
        <SickEmoji />
      </button>
      <button className="mx-1 h-6 w-6">
        <UpsideDownEmoji />
      </button>
      <button className="mx-1 h-6 w-6">
        <WorriedEmoji />
      </button>
    </div>
  );
}
