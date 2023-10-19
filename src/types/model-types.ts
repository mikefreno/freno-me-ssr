export interface User {
  id: string;
  email?: string;
  email_verified: boolean;
  display_name?: string;
  provider?: string;
  image?: string;
  password_hash?: string;
  registered_at: string;
}

export interface Blog {
  id: number;
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

export interface BlogLike {
  id: number;
  user_id: string;
  blog_id: number;
}

export interface Project {
  id: number;
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

export interface ProjectLike {
  id: number;
  user_id: string;
  project_id: number;
}

export interface Comment {
  id: number;
  body: string;
  blog_id?: number;
  project_id?: number;
  parent_comment_id?: number;
  commenter_id: string;
}

export interface CommentReaction {
  id: number;
  type: string;
  comment_id: number;
  user_id: string;
}
export interface PostWithCommentsAndLikes {
  id: number;
  title: string;
  subtitle: string;
  body: string;
  banner_photo: string;
  date: string;
  published: number;
  author_id: string;
  reads: number;
  attachments: string;
  total_likes: number;
  total_comments: number;
}
export interface Connection {
  id: number;
  connection_id: string;
  blog_id: number;
  project_id: number;
  user_id: string;
}
