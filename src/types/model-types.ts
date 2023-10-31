export interface User {
  id: string;
  email?: string;
  email_verified: boolean;
  password_hash?: string;
  display_name?: string;
  provider?: string;
  image?: string;
  registered_at: string;
}

export interface Post {
  id: number;
  category: "blog" | "project";
  title: string;
  subtitle?: string;
  body: string;
  banner_photo?: string;
  date: string;
  published: boolean;
  author_id: string;
  reads: number;
  attachments?: string;
}

export interface PostLike {
  id: number;
  user_id: string;
  post_id: number;
}

export interface Comment {
  id: number;
  body: string;
  post_id: number;
  parent_comment_id?: number;
  date: string;
  edited: boolean;
  commenter_id: string;
}

export interface CommentReaction {
  id: number;
  type: string;
  comment_id: number;
  user_id: string;
}

export interface Connection {
  id: number;
  user_id: string;
  connection_id: string;
  post_id?: number;
}

export interface Tag {
  id: number;
  value: string;
  post_id: number;
}

export interface PostWithCommentsAndLikes {
  id: number;
  category: "blog" | "project";
  title: string;
  subtitle: string;
  body: string;
  banner_photo: string;
  date: string;
  published: boolean;
  author_id: string;
  reads: number;
  attachments: string;
  total_likes: number;
  total_comments: number;
}
export interface PostWithTags {
  id: number;
  category: "blog" | "project";
  title: string;
  subtitle: string;
  body: string;
  banner_photo: string;
  date: string;
  published: boolean;
  author_id: string;
  reads: number;
  attachments: string;
  tags: Tag[];
}
