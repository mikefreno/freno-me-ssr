export interface User {
  id: string;
  email: string | undefined;
  email_verified: boolean;
  display_name: string | undefined;
  provider: string | undefined;
  image: string | null;
  password_hash: string | null;
  registered_at: string;
}

export interface Blog {
  id: number;
  title: string;
  subtitle: string | null;
  body: string;
  banner_photo: string | null;
  date: Date;
  published: boolean;
  author_id: string;
  reads: number;
}

export interface BlogLike {
  id: number;
  user_id: string;
  blog_id: number;
}

export interface Project {
  id: number;
  title: string;
  subtitle: string | null;
  body: string;
  banner_photo: string | null;
  date: Date;
  published: boolean;
  author_id: string;
  reads: number;
}

export interface ProjectLike {
  id: number;
  user_id: string;
  project_id: number;
}

export interface Comment {
  id: number;
  body: string;
  blog_id: number | null;
  project_id: number | null;
  parent_comment_id: number | null;
  commenter_id: string;
}

export interface CommentReaction {
  id: number;
  type: string;
  comment_id: number;
  user_id: string;
}
