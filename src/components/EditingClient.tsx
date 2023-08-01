"use client";

import AddImageToS3 from "@/app/s3upload";
import Dropzone from "@/components/Dropzone";
import TextEditor from "@/components/TextEditor";
import XCircle from "@/icons/XCircle";
import { Blog, Project } from "@/types/model-types";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import LoadingSpinner from "./LoadingSpinner";
import AddAttachmentSection from "./AddAttachmentSection";
import { env } from "@/env.mjs";
import Link from "next/link";

export default function EditingClient(props: {
  post: Project | Blog;
  type: "projects" | "blog";
}) {
  const [publish, setPublish] = useState<boolean>(props.post.published);
  const [bannerImage, setBannerImage] = useState<File | Blob>();
  const [bannerImageHolder, setBannerImageHolder] = useState<
    string | ArrayBuffer | null
  >(null);
  const [editorContent, setEditorContent] = useState<string>("");
  const [submitButtonLoading, setSubmitButtonLoading] =
    useState<boolean>(false);
  const router = useRouter();
  const [postTitle, setPostTitle] = useState<string | undefined>("");

  const [requestedDeleteImage, setRequestedDeleteImage] =
    useState<boolean>(false);
  const [showAutoSaveMessage, setShowAutoSaveMessage] =
    useState<boolean>(false);
  const [showSaveMessage, setShowSaveMessage] = useState<boolean>(false);

  const titleRef = useRef<HTMLInputElement>(null);
  const subtitleRef = useRef<HTMLInputElement>(null);
  const autosaveRef = useRef<NodeJS.Timeout | null>(null);

  const autoSave = async () => {
    if (titleRef.current) {
      let bannerImageKey = "";
      if (bannerImage) {
        bannerImageKey = await AddImageToS3(
          bannerImage,
          titleRef.current.value || props.post.title,
          props.type
        );
      }
      const data = {
        id: props.post.id,
        title:
          titleRef.current.value !== props.post.title
            ? titleRef.current.value
            : null,
        subtitle:
          subtitleRef.current?.value !== props.post.subtitle
            ? subtitleRef.current?.value
            : null,
        body: editorContent !== "" ? editorContent : null,
        embedded_link: null,
        banner_photo:
          bannerImageKey !== ""
            ? bannerImageKey
            : requestedDeleteImage
            ? "_DELETE_IMAGE_"
            : null,
        published: publish || props.post.published,
      };

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_DOMAIN}/api/database/${
          props.type == "blog" ? "blog" : "project"
        }/manipulation`,
        { method: "PATCH", body: JSON.stringify(data) }
      );
      if (res.status == 201) {
        showAutoSaveTrigger();
      }
    }
  };

  const showAutoSaveTrigger = () => {
    setShowAutoSaveMessage(true);
    setTimeout(() => {
      setShowAutoSaveMessage(false);
    }, 5000);
  };
  const showSaveTrigger = () => {
    setShowSaveMessage(true);
    setTimeout(() => {
      setShowSaveMessage(false);
    }, 5000);
  };

  useEffect(() => {
    autosaveRef.current = setInterval(() => {
      autoSave();
    }, 2 * 60 * 1000);

    return () => {
      if (autosaveRef.current) {
        clearInterval(autosaveRef.current);
      }
    };
  });

  const handleBannerImageDrop = useCallback((acceptedFiles: Blob[]) => {
    acceptedFiles.forEach((file: Blob) => {
      setRequestedDeleteImage(false);
      setBannerImage(file);
      const reader = new FileReader();
      reader.onload = () => {
        const str = reader.result;
        setBannerImageHolder(str);
      };
      reader.readAsDataURL(file);
    });
  }, []);

  const publishToggle = () => {
    setPublish(!publish);
  };

  const editPost = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitButtonLoading(true);
    if (titleRef.current) {
      let bannerImageKey = "";
      if (bannerImage) {
        bannerImageKey = await AddImageToS3(
          bannerImage,
          titleRef.current.value || props.post.title,
          props.type
        );
      }
      const data = {
        id: props.post.id,
        title:
          titleRef.current.value !== props.post.title
            ? titleRef.current.value
            : null,
        subtitle:
          subtitleRef.current?.value !== props.post.subtitle
            ? subtitleRef.current?.value
            : null,
        body: editorContent !== "" ? editorContent : null,
        embedded_link: null,
        banner_photo:
          bannerImageKey !== ""
            ? bannerImageKey
            : requestedDeleteImage
            ? "_DELETE_IMAGE_"
            : null,
        published: publish || props.post.published,
      };

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_DOMAIN}/api/database/${
          props.type == "blog" ? "blog" : "project"
        }/manipulation`,
        { method: "PATCH", body: JSON.stringify(data) }
      );
      if (res.status == 201) {
        showSaveTrigger();
      }
      setSubmitButtonLoading(false);
    }
  };

  const removeImage = () => {
    setBannerImage(undefined);
    setBannerImageHolder(null);
    setRequestedDeleteImage(true);
  };

  if (!props.post) {
    return (
      <>
        <LoadingSpinner height={48} width={48} />
      </>
    );
  }

  return (
    <div className="px-8 py-32 dark:text-white">
      <div className="text-center text-2xl tracking-wide">
        Edit a {props.type == "blog" ? "Blog" : "Project"}
      </div>
      <div className="flex h-full w-full justify-center">
        <form onSubmit={editPost} className="w-full md:w-3/4 lg:w-1/3 xl:w-1/2">
          <div className="input-group mx-4">
            <input
              ref={titleRef}
              type="text"
              required
              name="title"
              placeholder=" "
              onBlur={() => setPostTitle(titleRef.current?.value)}
              onChange={() => setPostTitle(titleRef.current?.value)}
              defaultValue={props.post.title ? props.post.title : ""}
              className="bg-transparent underlinedInput w-full"
            />
            <span className="bar"></span>
            <label className="underlinedInputLabel">Title</label>
          </div>
          <div className="input-group mx-4">
            <input
              ref={subtitleRef}
              type="text"
              required
              name="subtitle"
              placeholder=" "
              defaultValue={props.post.subtitle ? props.post.subtitle : ""}
              className="bg-transparent underlinedInput w-full"
            />
            <span className="bar"></span>
            <label className="underlinedInputLabel">Subtitle</label>
          </div>
          <div className="text-center text-xl pt-8">Banner</div>
          <div className="flex justify-center pb-8">
            <Dropzone
              onDrop={handleBannerImageDrop}
              acceptedFiles={"image/jpg, image/jpeg, image/png"}
              fileHolder={bannerImageHolder}
              preSet={
                requestedDeleteImage
                  ? null
                  : props.post.banner_photo
                  ? props.post.banner_photo
                  : null
              }
            />
            <button
              type="button"
              className="rounded-full h-fit -ml-6 z-50"
              onClick={removeImage}
            >
              <XCircle
                height={36}
                width={36}
                stroke={"black"}
                strokeWidth={1}
              />
            </button>
          </div>
          <AddAttachmentSection
            type={props.type}
            post={props.post}
            postTitle={postTitle || props.post.title}
          />

          <div className="md:-mx-36">
            <TextEditor
              updateContent={setEditorContent}
              preSet={props.post.body}
            />
          </div>
          <div
            className={`${
              showAutoSaveMessage || showSaveMessage
                ? ""
                : "user-select opacity-0"
            } text-green-400 text-center italic transition-opacity flex justify-center duration-500 ease-in-out min-h-[16px]`}
          >
            {showSaveMessage
              ? "Save success!"
              : showAutoSaveMessage
              ? "Auto save success!"
              : ""}
          </div>
          <div className="flex justify-end pt-4 pb-2">
            <input
              type="checkbox"
              className="my-auto"
              name="publish"
              defaultChecked={props.post.published}
              onChange={publishToggle}
            />
            <div className="my-auto px-2 text-sm font-normal">Publish</div>
          </div>
          <div className="flex justify-end">
            <button
              type={"submit"}
              disabled={submitButtonLoading}
              className={`${
                submitButtonLoading
                  ? "bg-zinc-400"
                  : publish
                  ? `bg-${
                      props.type == "blog" ? "orange" : "blue"
                    }-400 dark:bg-${
                      props.type == "blog" ? "orange" : "blue"
                    }-600 hover:bg-${
                      props.type == "blog" ? "orange" : "blue"
                    }-500 dark:hover:bg-${
                      props.type == "blog" ? "orange" : "blue"
                    }-700`
                  : "bg-green-400 dark:bg-green-600 hover:bg-green-500 dark:hover:bg-green-700"
              } active:scale-90 text-white flex w-36 justify-center rounded transition-all duration-300 ease-out py-3 text-white"`}
            >
              {submitButtonLoading
                ? "Loading..."
                : publish
                ? "Publish!"
                : "Save as Draft"}
            </button>
          </div>
        </form>
      </div>
      <div className="flex justify-center mt-2">
        <Link
          href={`${env.NEXT_PUBLIC_DOMAIN}/${props.type}/${
            titleRef.current?.value || props.post.title
          }`}
          className="border-blue-500 bg-blue-400 hover:bg-blue-500 dark:bg-blue-700 dark:hover:bg-blue-800 dark:border-blue-700 rounded border text-white shadow-md  active:scale-90 transition-all duration-300 ease-in-out px-4 py-2"
        >
          Go to Post
        </Link>
      </div>
    </div>
  );
}
