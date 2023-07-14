/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import CommentBlock from "@/components/CommentBlock";
import CommentIcon from "@/icons/CommentIcon";
import CommentInputBlock from "@/components/CommentInputBlock";
import { env } from "@/env.mjs";
import Link from "next/link";
import { API_RES_GetProjectWithComments } from "@/types/response-types";

export default async function DynamicProjectPost({
  params,
}: {
  params: { title: string };
}) {
  const projectQuery = await fetch(
    `${env.NEXT_PUBLIC_DOMAIN}/api/database/project/by-title/${params.title}`,
    {
      method: "GET",
      cache: "no-store",
    }
  );
  const parsedQueryRes =
    (await projectQuery.json()) as API_RES_GetProjectWithComments;

  const project = parsedQueryRes.project;
  const privilegeLevel = parsedQueryRes.privilegeLevel;
  const comments = parsedQueryRes.comments;
  const topLevelComments = parsedQueryRes.comments.filter(
    (comment) => comment.parent_comment_id == null
  );

  // const giveProjectLike = async () => {
  //   setLikeButtonLoading(true);
  //   if (project && project.id) {
  //     const res = await projectLikeMutation.mutateAsync(project.id);
  //     setProject(res);
  //   }
  //   setLikeButtonLoading(false);
  // };
  // const toggleUserNameSetModal = () => {
  //   setShowingUserNameSetModal(!showingUserNameSetModal);
  // };

  if (!project) {
    return (
      <div className="h-screen w-screen">
        <div className="mt-[20vh] flex w-full justify-center text-4xl">
          No project found!
        </div>
        <div className="flex justify-center pt-12">
          <Link
            href="/blog"
            className="rounded border text-white shadow-md border-blue-500 bg-blue-400 hover:bg-blue-500 dark: dark:bg-blue-700 dark:hover:bg-blue-800 dark:border-blue-700 active:scale-90 transition-all duration-300 ease-in-out px-4 py-2"
          >
            Back to blog main page
          </Link>
        </div>
      </div>
    );
  }

  // const submitComment = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (commentInputRef.current) {
  //     if (commentInputRef.current.value.length > 0) {
  //       await createCommentMutation.mutateAsync({
  //         id: project.id,
  //         message: commentInputRef.current.value,
  //         category: "project",
  //       });
  //     }
  //     await topLevelCommentSetter(id!.toString());
  //     commentInputRef.current.value = "";
  //   }
  // };

  // const sessionDependantLike = () => {
  //   if (likeButtonLoading) {
  //     return <Loading />;
  //   } else if (status == "authenticated") {
  //     return (
  //       <Tooltip content={"Leave a Like"} placement="bottom">
  //         <button
  //           className="flex py-2 hover:brightness-50"
  //           onClick={() => giveProjectLike()}
  //         >
  //           <LikeIcon
  //             strokeWidth={1}
  //             color={
  //               project.likes.some((like) => like.user_id == session?.user.id)
  //                 ? "#60a5fa"
  //                 : isDarkTheme
  //                 ? "white"
  //                 : "black"
  //             }
  //             height={32}
  //             width={32}
  //           />
  //           <div
  //             className={`${
  //               project.likes.some((like) => like.user_id == session?.user.id)
  //                 ? "text-blue-400"
  //                 : "text-black dark:text-white"
  //             } my-auto pl-2 `}
  //           >
  //             {project.likes.length}{" "}
  //             {project.likes.length == 1 ? "Like" : "Likes"}
  //           </div>
  //         </button>
  //       </Tooltip>
  //     );
  //   } else {
  //     return (
  //       <Tooltip content={"Must be logged in to Like"} placement="bottom">
  //         <button className="flex py-2 hover:brightness-50">
  //           <LikeIcon
  //             strokeWidth={1}
  //             color={isDarkTheme ? "white" : "black"}
  //             height={32}
  //             width={32}
  //           />
  //           <div
  //             className="my-auto pl-2
  //             text-black dark:text-white"
  //           >
  //             {project.likes.length}{" "}
  //             {project.likes.length == 1 ? "Like" : "Likes"}
  //           </div>
  //         </button>
  //       </Tooltip>
  //     );
  //   }
  // };

  return (
    <div className="mx-8 min-h-screen py-14">
      <div className="flex justify-between">
        <div className="flex flex-col">
          <h1 className="pl-24 pt-8 font-light tracking-widest">
            {project.title}
          </h1>
          <h3 className="pl-32 font-light tracking-widest">
            {project.subtitle}
          </h3>
        </div>
        <div className="my-auto flex justify-end">
          <div className="flex flex-col">
            <div className="flex justify-end">
              <Link href="#comments">
                <div className="flex">
                  <CommentIcon strokeWidth={1} height={32} width={32} />
                  <div className="my-auto pl-2 text-black dark:text-white">
                    {/* {top == 1 ? "Comment" : "Comments"} */}
                  </div>
                </div>
              </Link>
            </div>
            {/* <div className="flex justify-end">{sessionDependantLike()}</div> */}
          </div>
        </div>
      </div>
      <div>
        <img
          src={project.banner_photo || "/blueprint.jpg"}
          className="h-96 w-full object-cover object-center"
        />
      </div>
      <div
        className="px-24 py-4"
        dangerouslySetInnerHTML={{ __html: project.body }}
      />
      <div className="px-8 sm:px-12 md:px-16">
        <div
          className="text-center text-2xl font-light tracking-widest underline underline-offset-8"
          id="comments"
        >
          Comments
        </div>
        <div>
          <CommentInputBlock isReply={false} privilegeLevel={privilegeLevel} />
        </div>
        <div className="pl-16">
          {topLevelComments?.map((topLevelComment) => (
            <CommentBlock
              key={topLevelComment.id}
              comment={topLevelComment}
              category={"project"}
              projectID={project.id}
              recursionCount={1}
              allComments={comments}
              child_comments={comments.filter(
                (comment) => comment.parent_comment_id == topLevelComment.id
              )}
              privilegeLevel={privilegeLevel}
              userID={""}
            />
          ))}
        </div>
      </div>
      <div></div>
    </div>
  );
}
