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
    <div className="relative w-full z-0 md:w-5/6 lg:w-3/4 xl:w-3/5 mx-auto h-96 bg-white shadow-lg rounded-lg overflow-hidden">
      {props.privilegeLevel !== "admin" ? null : (
        <div className="absolute top-0 w-full bg-white bg-opacity-40 backdrop-blur-md border-b border-white border-opacity-20 py-4 px-2 md:px-6">
          <div className="flex justify-between">
            {props.post.published ? null : (
              <div className="text-center whitespace-nowrap text-lg text-black">
                Not Published
              </div>
            )}
            <DeletePostButton
              type={props.linkTarget == "blog" ? "Blog" : "Project"}
              postId={props.post.id}
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
        className="w-full h-full object-cover"
      />
      <div className="absolute bottom-0 w-full bg-white bg-opacity-40 backdrop-blur-md border-t border-white border-opacity-20 py-4 px-2 md:px-6">
        <div className="flex md:flex-row flex-col justify-between items-center">
          <div className="text-center md:text-left">
            <div className="text-lg md:text-xl text-black">
              {props.post.subtitle}
            </div>
            <div className="text-2xl md:text-3xl text-black">
              {props.post.title.replaceAll("_", " ")}
            </div>
          </div>
          <div className="flex justify-around md:justify-between md:pl-2 pt-2 w-full md:pt-0 md:w-3/5">
            <div>
              <p className="text-black text-sm whitespace-nowrap">
                {props.post.total_comments || 0} Comments
              </p>
              <p className="text-black text-sm whitespace-nowrap">
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
