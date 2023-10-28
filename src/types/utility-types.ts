//type WebSocketPayload = {
//messageType: "comment" | "channelUpdate";
//commentType?: "create" | "update" | "delete";
//commentBody?: string;
//postType: "blog" | "project";
//blog_id?: number;
//project_id?: number;
//parent_comment_id?: number;
//invoker_id: string;
//comment_id?: number;
//deletionAgent?: "user" | "admin";
//};

export interface websocket_broadcast {
  action: "commentCreation" | "commentUpdate" | "commentDeletion";
  commentBody?: string;
  commentID?: number;
  commenterID?: string;
  commentParent?: number;
  reactionType?: string;
  endEffect?: string;
  reactingUserID?: string;
}
export interface backup_res {
  commentBody: string;
  commentID: number;
  commenterID: string;
  commentParent?: number;
}
