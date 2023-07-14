import { Blog, Comment, Project } from "./model-types";

export interface API_RES_GPDP {
  status: number;
  rows: Project[];
  privilegeLevel: "admin" | "user" | "anonymous";
}
export interface API_RES_GPDB {
  status: number;
  rows: Blog[];
  privilegeLevel: "admin" | "user" | "anonymous";
}
export interface API_RES_UDNS {
  email: string | undefined;
  id: string | undefined;
  image: string | undefined;
}
export interface API_RES_GBWC {
  status: number;
  blog: Blog | undefined;
  comments: Comment[];
  privilegeLevel: "admin" | "user" | "anonymous";
}
export interface API_RES_GPWC {
  status: number;
  project: Project | undefined;
  comments: Comment[];
  privilegeLevel: "admin" | "user" | "anonymous";
}
