type WebSocketPayload = {
  messageType: "comment" | "channelUpdate";
  commentType?: "create" | "update" | "delete";
  commentBody?: string;
  postType: "blog" | "project";
  blog_id?: number;
  project_id?: number;
  parent_comment_id?: number;
  invoker_id: string;
  comment_id?: number;
  deletionAgent?: "user" | "admin";
};
