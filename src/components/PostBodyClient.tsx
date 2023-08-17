"use client";

import { useEffect } from "react";
import hljs from "highlight.js";

export default function PostBodyClient(props: {
  body: string;
  hasCodeBlock: boolean;
}) {
  useEffect(() => {
    setTimeout(() => {
      hljs.highlightAll();
    }, 500);
  }, []);

  return (
    <div className="flex justify-center">
      <div
        className={`ProseMirror py-8 md:py-12 ${
          props.hasCodeBlock ? "mx-12" : "mx-4"
        } select-text prose prose-sm sm:prose md:prose-base lg:prose-xl xl:prose-2xl dark:prose-invert dark:sm:prose-invert dark:md:prose-invert dark:lg:prose-invert dark:xl:prose-invert`}
      >
        <div
          className={`${props.hasCodeBlock ? "mx-24 md:mx-0" : ""}`}
          dangerouslySetInnerHTML={{
            __html: props.body,
          }}
        />
      </div>
    </div>
  );
}
