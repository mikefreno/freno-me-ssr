"use client";
import { PostWithCommentsAndLikes, Tag } from "@/types/model-types";
import Card from "./Card";
import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function PostSorting(props: {
  posts: PostWithCommentsAndLikes[];
  tags: Tag[];
  privilegeLevel: "anonymous" | "admin" | "user";
  type: "blog" | "projects";
}) {
  const [sort, setSort] = useState<string>("newest");
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [postFilters, setPostFilters] = useState<string[] | undefined>([]);
  const [filteredPosts, setFilteredPosts] = useState<
    PostWithCommentsAndLikes[]
  >(props.posts);

  useEffect(() => {
    const sortParam = searchParams.get("sort");
    const filterParam = searchParams.get("filter");
    if (
      sortParam &&
      ["newest", "oldest", "most liked", "most read", "most comments"].includes(
        sortParam,
      )
    ) {
      setSort(sortParam);
    }
    const filters = filterParam?.split("|");
    setPostFilters(filters);
  }, [searchParams, pathname]);

  useEffect(() => {
    let postsToFilter = new Set<number>();
    props.tags.forEach((tag) => {
      if (postFilters?.includes(tag.value.slice(1))) {
        postsToFilter.add(tag.post_id);
      }
    });
    const newFilteredPosts = props.posts.filter((post) => {
      return !postsToFilter.has(post.id);
    });
    setFilteredPosts(newFilteredPosts);
  }, [postFilters, props.posts, props.tags]);

  if (props.posts.length > 0 && filteredPosts.length == 0) {
    return (
      <div className="pt-12 text-center text-2xl italic tracking-wide">
        All posts filtered out!
      </div>
    );
  }
  switch (sort) {
    case "newest":
      return [...filteredPosts].reverse().map((post) => (
        <div key={post.id} className="my-4">
          <Card
            post={post}
            privilegeLevel={props.privilegeLevel}
            linkTarget={props.type}
          />
        </div>
      ));

    case "oldest":
      return [...filteredPosts].map((post) => (
        <div key={post.id} className="my-4">
          <Card
            post={post}
            privilegeLevel={props.privilegeLevel}
            linkTarget={props.type}
          />
        </div>
      ));

    case "most liked":
      return [...filteredPosts]
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
      return [...filteredPosts]
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
      return [...filteredPosts]
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
