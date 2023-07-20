export interface CommentReactionInput {
  comment_id: number;
  user_id: string;
}
export interface PostLikeInput {
  user_id: string;
  post_id: number;
  post_type: "Project | Blog";
}
export interface newEmailInput {
  id: string;
  newEmail: string;
}
