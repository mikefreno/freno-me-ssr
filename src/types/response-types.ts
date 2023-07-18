import {
  Blog,
  BlogLike,
  Comment,
  CommentReaction,
  Project,
  ProjectLike,
} from "./model-types";

export interface API_RES_GetPrivilegeDependantProjects {
  status: number;
  rows: Project[];
  privilegeLevel: "admin" | "user" | "anonymous";
}
export interface API_RES_GetPrivilegeDependantBlogs {
  status: number;
  rows: Blog[];
  privilegeLevel: "admin" | "user" | "anonymous";
}
export interface API_RES_UserDataNonSensitive {
  email: string | undefined;
  id: string | undefined;
  image: string | undefined;
}
export interface API_RES_GetBlogWithComments {
  status: number;
  blog: Blog[];
  comments: Comment[];
  likes: BlogLike[];
  reactionArray: [number, CommentReaction[]][];
}
export interface API_RES_GetProjectWithComments {
  status: number;
  project: Project[];
  comments: Comment[];
  likes: ProjectLike[];
  reactionArray: [number, CommentReaction[]][];
}
export interface API_RES_GetCommentAndLikeCount {
  status: number;
  commentCount: number;
  likeCount: number;
}
