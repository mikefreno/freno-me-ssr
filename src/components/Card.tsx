import Image from "next/image";
import { Blog, Project } from "@/types/model-types";
import { env } from "@/env.mjs";
import { API_RES_GetCommentAndLikeCount } from "@/types/response-types";
import CardLinks from "./CardLinks";
import DeletePostButton from "./DeletePostButton";

export default async function ProjectCard(props: {
  project: Project | Blog;
  privilegeLevel: string;
  linkTarget: "blog" | "projects";
}) {
  const query = await fetch(
    `${env.NEXT_PUBLIC_DOMAIN}/api/database/generic/get-comment-and-like-count/${props.linkTarget}/${props.project.id}`,
    {
      method: "GET",
      cache: "no-store",
    }
  );
  const queryResData = (await query.json()) as API_RES_GetCommentAndLikeCount;

  return (
    <div className="relative w-full md:w-5/6 lg:w-3/4 xl:w-3/5 mx-auto h-96 bg-white shadow-lg rounded-lg overflow-hidden">
      {props.privilegeLevel !== "admin" ? null : (
        <div className="absolute top-0 w-full bg-white bg-opacity-40 backdrop-blur-md border-b border-white border-opacity-20 py-4 px-2 md:px-6">
          <div className="flex justify-between">
            {props.project.published ? null : (
              <div className="text-center whitespace-nowrap text-lg text-black">
                Not Published
              </div>
            )}
            <DeletePostButton
              type={props.linkTarget == "blog" ? "Blog" : "Project"}
              postId={props.project.id}
            />
          </div>
        </div>
      )}
      <Image
        src={
          props.project.banner_photo
            ? props.project.banner_photo
            : props.linkTarget == "blog"
            ? "/bitcoin.jpg"
            : "/blueprint.jpg"
        }
        alt={props.project.title + " banner"}
        height={1000}
        width={1000}
        className="w-full h-full object-cover"
      />
      <div className="absolute bottom-0 w-full bg-white bg-opacity-40 backdrop-blur-md border-t border-white border-opacity-20 py-4 px-2 md:px-6">
        <div className="flex md:flex-row flex-col justify-between items-center">
          <div className="text-center md:text-left">
            <div className="text-lg md:text-xl text-black">
              {props.project.subtitle}
            </div>
            <div className="text-2xl md:text-3xl text-black">
              {props.project.title}
            </div>
          </div>
          <div className="flex justify-around md:justify-between pt-2 w-full md:pt-0 md:w-1/2">
            <div>
              <p className="text-black text-sm">
                {queryResData.commentCount || 0} Comments
              </p>
              <p className="text-black text-sm">
                {queryResData.likeCount || 0} Likes
              </p>
            </div>
            <CardLinks
              projectTitle={props.project.title}
              linkTarget={props.linkTarget}
              privilegeLevel={props.privilegeLevel}
              projectID={props.project.id}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
