"use client";

import { useEffect } from "react";
import hljs from "highlight.js/lib/common";

export default function PostBodyClient(props: { body: string }) {
  useEffect(() => {
    hljs.highlightAll();
  }, []);

  return (
    <div className="sm:flex sm:justify-center">
      <div
        className="ProseMirror py-8 md:py-12 select-text prose prose-sm sm:prose md:prose-base lg:prose-lg xl:prose-xl  dark:prose-invert sm:dark:prose-invert md:dark:prose-invert lg:dark:prose-invert"
        dangerouslySetInnerHTML={{
          __html: props.body,
        }}
      />
    </div>
  );
}
