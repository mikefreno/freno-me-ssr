"use client";

import { useCallback, useEffect, useState } from "react";
import Dropzone from "./Dropzone";
import XCircle from "@/icons/XCircle";
import { env } from "@/env.mjs";
import AddImageToS3 from "@/app/s3upload";
import { Post } from "@/types/model-types";

export default function AddAttachmentSection(props: {
  type: "blog" | "project";
  post: Post | null;
  postTitle: string | undefined;
}) {
  const [images, setImages] = useState<(File | Blob)[]>([]);
  const [imageHolder, setImageHolder] = useState<(string | ArrayBuffer)[]>([]);
  const [newImageHolder, setNewImageHolder] = useState<
    (string | ArrayBuffer)[]
  >([]);
  const [newImageHolderKeys, setNewImageHolderKeys] = useState<string[]>([]);

  useEffect(() => {
    if (props.post && props.post.attachments) {
      const imgStringArr = props.post.attachments.split(",");
      setImageHolder(imgStringArr);
    }
  }, [props.post]);

  const handleImageDrop = useCallback(
    (acceptedFiles: Blob[]) => {
      if (props.postTitle) {
        acceptedFiles.forEach(async (file: Blob) => {
          setImages((prevImages) => [...prevImages, file]);
          const key = (await AddImageToS3(
            file,
            props.postTitle!,
            props.type,
          )) as string;
          setNewImageHolderKeys((prevKeys) => [...prevKeys, key]);
          const reader = new FileReader();
          reader.onload = () => {
            const str = reader.result;
            if (str)
              setNewImageHolder((prevHeldImages) => [
                ...prevHeldImages,
                str as string,
              ]);
          };
          reader.readAsDataURL(file);
        });
      }
    },
    [props.postTitle, props.type],
  );

  const removeImage = async (index: number, key: string) => {
    if (props.post && props.post.attachments) {
      const imgStringArr = props.post.attachments.split(",");
      const newString = imgStringArr
        .filter((str: string) => str !== key)
        .join(",");
      const res = await fetch("/api/s3/deleteImage", {
        method: "POST",
        body: JSON.stringify({
          key: key,
          newAttachmentString: newString,
          id: props.post.id,
        }),
      });
      console.log(res.json());
      setImages((prevImages) =>
        prevImages.filter((_, i) => i !== index - imageHolder.length),
      );
      setImageHolder((prevHeldImages) =>
        prevHeldImages.filter((_, i) => i !== index),
      );
    }
  };

  const removeNewImage = async (index: number, key: string) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
    setNewImageHolder((prevHeldImages) =>
      prevHeldImages.filter((_, i) => i !== index),
    );
    await fetch("/api/s3/simpleDeleteImage", {
      method: "POST",
      body: JSON.stringify({
        key: key,
      }),
    });
  };

  const copyToClipboard = async (key: string) => {
    try {
      await navigator.clipboard.writeText(
        env.NEXT_PUBLIC_AWS_BUCKET_STRING + key,
      );
      console.log("Text copied to clipboard");
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  if (!props.postTitle) {
    return (
      <>
        <div className="pb-4 text-center italic">
          Add title to add attachments
        </div>
      </>
    );
  }

  return (
    <>
      <div className="text-center text-xl">Attachments</div>
      <div className="flex justify-center">
        <Dropzone
          onDrop={handleImageDrop}
          acceptedFiles={"image/jpg, image/jpeg, image/png"}
          fileHolder={null}
          preSet={null}
        />
      </div>
      <div className="-mx-24 grid grid-cols-6 gap-4">
        {imageHolder.map((key, index) => (
          <div key={index}>
            <button
              type="button"
              className="absolute ml-4 pb-[120px] hover:bg-white hover:bg-opacity-80"
              onClick={() => removeImage(index, key as string)}
            >
              <XCircle
                height={24}
                width={24}
                stroke={"black"}
                strokeWidth={1}
              />
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element,
                    jsx-a11y/alt-text */}
            <img src={key as string} className="mx-4 my-auto h-36 w-36" />
          </div>
        ))}
        <div className="mx-auto border-r border-black" />
        {images.map((_, index) => (
          <div key={index}>
            <button
              type="button"
              className="absolute ml-4 pb-[120px] hover:bg-white hover:bg-opacity-80"
              onClick={() => removeNewImage(index, newImageHolderKeys[index])}
            >
              <XCircle
                height={24}
                width={24}
                stroke={"black"}
                strokeWidth={1}
              />
            </button>
            <button
              type="button"
              onClick={() =>
                copyToClipboard(newImageHolderKeys[index] as string)
              }
            >
              {/* eslint-disable-next-line @next/next/no-img-element,
                    jsx-a11y/alt-text */}
              <img
                src={newImageHolder[index] as string}
                className="mx-4 my-auto h-36 w-36"
              />
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
