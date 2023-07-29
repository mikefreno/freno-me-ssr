import {
  Blog,
  BlogLike,
  Comment,
  CommentReaction,
  PostWithCommentsAndLikes,
  Project,
  ProjectLike,
} from "./model-types";

export interface API_RES_GetPrivilegeDependantProjects {
  status: number;
  rows: PostWithCommentsAndLikes[];
  privilegeLevel: "admin" | "user" | "anonymous";
}
export interface API_RES_GetPrivilegeDependantBlogs {
  status: number;
  rows: PostWithCommentsAndLikes[];
  privilegeLevel: "admin" | "user" | "anonymous";
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
export interface API_RES_GetUserDataFromCookie {
  id: string;
  email: string | undefined;
  emailVerified: boolean;
  image: string | null;
  displayName: string | undefined;
  provider: string | undefined;
  hasPassword: boolean;
}
