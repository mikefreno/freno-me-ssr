import Image from "next/image";
import { PostWithCommentsAndLikes } from "@/types/model-types";
import CardLinks from "./CardLinks";
import DeletePostButton from "./DeletePostButton";

export default async function PostCard(props: {
  post: PostWithCommentsAndLikes;
  privilegeLevel: "anonymous" | "admin" | "user";
  linkTarget: "blog" | "projects";
}) {
  return (
    <div className="relative z-0 mx-auto h-96 w-full overflow-hidden rounded-lg bg-white shadow-lg md:w-5/6 lg:w-3/4">
      {props.privilegeLevel !== "admin" ? null : (
        <div className="absolute top-0 w-full border-b border-white border-opacity-20 bg-white bg-opacity-40 px-2 py-4 backdrop-blur-md md:px-6">
          <div className="flex justify-between">
            {props.post.published ? null : (
              <div className="whitespace-nowrap text-center text-lg text-black">
                Not Published
              </div>
            )}
            <DeletePostButton
              type={props.linkTarget == "blog" ? "Blog" : "Project"}
              postID={props.post.id}
            />
          </div>
        </div>
      )}
      <Image
        src={
          props.post.banner_photo
            ? props.post.banner_photo
            : props.linkTarget == "blog"
            ? "/bitcoin.jpg"
            : "/blueprint.jpg"
        }
        alt={props.post.title.replaceAll("_", " ") + " banner"}
        height={1000}
        width={1000}
        className="h-full w-full object-cover"
      />
      <div className="absolute bottom-0 w-full border-t border-white border-opacity-20 bg-white bg-opacity-40 px-2 py-4 backdrop-blur-md md:px-6">
        <div className="flex flex-col items-center justify-between md:flex-row">
          <div className="text-center md:text-left">
            <div className="text-lg text-black md:text-xl">
              {props.post.subtitle}
            </div>
            <div className="text-2xl text-black md:text-3xl">
              {props.post.title.replaceAll("_", " ")}
            </div>
          </div>
          <div className="flex w-full justify-around pt-2 md:w-1/3 md:justify-between md:pl-2 md:pt-0">
            <div className="my-auto md:h-full">
              <p className="whitespace-nowrap text-sm text-black">
                {props.post.total_comments || 0} Comments
              </p>
              <p className="whitespace-nowrap text-sm text-black">
                {props.post.total_likes || 0} Likes
              </p>
            </div>
            <CardLinks
              postTitle={props.post.title}
              linkTarget={props.linkTarget}
              privilegeLevel={props.privilegeLevel}
              postID={props.post.id}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
