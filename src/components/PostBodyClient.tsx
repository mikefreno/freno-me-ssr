"use client";

import { useEffect, useState, useRef } from "react";
import hljs from "highlight.js";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Zoom from "yet-another-react-lightbox/plugins/zoom";

export default function PostBodyClient(props: {
  body: string;
  hasCodeBlock: boolean;
  banner_photo?: string;
}) {
  const [attachmentArray, setAttachmentArray] = useState<{ src: string }[]>([]);
  const [showingLightbox, setShowingLightbox] = useState<boolean>(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTimeout(() => {
      hljs.highlightAll();
    }, 500);
  }, []);

  useEffect(() => {
    const parser = new DOMParser();
    const imgTags = parser
      .parseFromString(props.body, "text/html")
      .getElementsByTagName("img");

    if (imgTags && imgTags.length > 0) {
      let attachments = [];
      for (let i = 0; i < imgTags.length; i++) {
        let src = imgTags[i].getAttribute("src");
        if (src) {
          attachments.push({ src: src });
        }
      }

      if (props.banner_photo) {
        attachments.push({ src: props.banner_photo });
      }

      //console.log("Attachments: ", attachments);
      setAttachmentArray(attachments);
    }
  }, [props.banner_photo, props.body]);

  const eventHandler = () => {
    setShowingLightbox(!showingLightbox);
  };

  useEffect(() => {
    const imgs = document.getElementsByTagName("img");
    for (let i = 0; i < imgs.length; i++) {
      imgs[i].addEventListener("click", eventHandler);
    }
    return () => {
      for (let i = 0; i < imgs.length; i++) {
        imgs[i].removeEventListener("click", eventHandler);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contentRef.current, showingLightbox]);

  return (
    <>
      <div className="flex justify-center">
        <div
          className={`ProseMirror py-8 md:py-16 lg:py-20 select-text max-w-[95%] prose sm:prose md:prose-lg lg:prose-xl xl:prose-2xl dark:prose-invert dark:sm:prose-invert dark:md:prose-invert dark:lg:prose-invert dark:xl:prose-invert`}
        >
          <div
            ref={contentRef}
            className={`max-w-full`}
            dangerouslySetInnerHTML={{
              __html: props.body,
            }}
          />
        </div>
      </div>
      <Lightbox
        open={showingLightbox}
        close={() => setShowingLightbox(false)}
        slides={attachmentArray}
        plugins={[Zoom]}
      />
    </>
  );
}
