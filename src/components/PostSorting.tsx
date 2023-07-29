"use client";
import { PostWithCommentsAndLikes } from "@/types/model-types";
import Card from "./Card";
import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function PostSorting(props: {
  posts: PostWithCommentsAndLikes[];
  privilegeLevel: "anonymous" | "admin" | "user";
  type: "blog" | "projects";
}) {
  const [sort, setSort] = useState<string>("newest");
  const searchParams = useSearchParams();
  const pathname = usePathname();

  useEffect(() => {
    const sortParam = searchParams.get("sort");
    if (
      sortParam &&
      ["newest", "oldest", "most liked", "most read", "most comments"].includes(
        sortParam
      )
    ) {
      setSort(sortParam);
    }
  }, [searchParams, pathname]);

  switch (sort) {
    case "newest":
      return [...props.posts].reverse().map((post) => (
        <div key={post.id} className="my-4">
          <Card
            post={post}
            privilegeLevel={props.privilegeLevel}
            linkTarget={props.type}
          />
        </div>
      ));

    case "oldest":
      return [...props.posts].map((post) => (
        <div key={post.id} className="my-4">
          <Card
            post={post}
            privilegeLevel={props.privilegeLevel}
            linkTarget={props.type}
          />
        </div>
      ));

    case "most liked":
      return [...props.posts]
        .sort((a, b) => b.total_likes - a.total_likes)
        .map((post) => (
          <div key={post.id} className="my-4">
            <Card
              post={post}
              privilegeLevel={props.privilegeLevel}
              linkTarget={props.type}
            />
          </div>
        ));

    case "most read":
      return [...props.posts]
        .sort((a, b) => b.reads - a.reads)
        .map((post) => (
          <div key={post.id} className="my-4">
            <Card
              post={post}
              privilegeLevel={props.privilegeLevel}
              linkTarget={props.type}
            />
          </div>
        ));

    case "most comments":
      return [...props.posts]
        .sort((a, b) => b.total_comments - a.total_comments)
        .map((post) => (
          <div key={post.id} className="my-4">
            <Card
              post={post}
              privilegeLevel={props.privilegeLevel}
              linkTarget={props.type}
            />
          </div>
        ));
  }
}
