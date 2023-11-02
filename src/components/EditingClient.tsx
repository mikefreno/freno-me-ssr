"use client";

import AddImageToS3 from "@/app/s3upload";
import Dropzone from "@/components/Dropzone";
import TextEditor from "@/components/TextEditor";
import XCircle from "@/icons/XCircle";
import { Post, Tag } from "@/types/model-types";
import { useCallback, useEffect, useRef, useState } from "react";
import LoadingSpinner from "./LoadingSpinner";
import AddAttachmentSection from "./AddAttachmentSection";
import { env } from "@/env.mjs";
import Link from "next/link";
import TagMaker from "./TagMaker";

export default function EditingClient(props: { post: Post; tags: Tag[] }) {
  const [publish, setPublish] = useState<boolean>(props.post.published);
  const [bannerImage, setBannerImage] = useState<File | Blob>();
  const [bannerImageHolder, setBannerImageHolder] = useState<
    string | ArrayBuffer | null
  >(null);
  const [editorContent, setEditorContent] = useState<string>("");
  const [submitButtonLoading, setSubmitButtonLoading] =
    useState<boolean>(false);
  const [requestedDeleteImage, setRequestedDeleteImage] =
    useState<boolean>(false);
  const [showAutoSaveMessage, setShowAutoSaveMessage] =
    useState<boolean>(false);
  const [showSaveMessage, setShowSaveMessage] = useState<boolean>(false);
  const [postTitle, setPostTitle] = useState<string>(props.post.title);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInputValue, setTagInputValue] = useState<string>("");

  const subtitleRef = useRef<HTMLInputElement>(null);
  const autosaveRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (props.tags) {
      let initTags: string[] = [];
      props.tags.forEach((tag) => initTags.push(tag.value));
      setTags(initTags);
    }
  }, [props.tags]);

  const autoSave = async () => {
    if (postTitle) {
      let bannerImageKey = "";
      if (bannerImage) {
        bannerImageKey = (await AddImageToS3(
          bannerImage,
          postTitle || props.post.title,
          props.post.category,
        )) as string;
      }
      const data = {
        id: props.post.id,
        title: postTitle.replaceAll(" ", "_"),
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
        tags: tags,
      };

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_DOMAIN}/api/database/post/${props.post.category}/manipulation`,
        { method: "PATCH", body: JSON.stringify(data) },
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
    autosaveRef.current = setInterval(
      () => {
        autoSave();
      },
      2 * 60 * 1000,
    );

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
    if (postTitle) {
      let bannerImageKey = "";
      if (bannerImage) {
        bannerImageKey = (await AddImageToS3(
          bannerImage,
          postTitle || props.post.title,
          props.post.category,
        )) as string;
      }
      console.log("banner key: ", bannerImageKey);
      const data = {
        id: props.post.id,
        title: postTitle.replaceAll(" ", "_"),
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
        tags: tags,
      };

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_DOMAIN}/api/database/post/${props.post.category}/manipulation`,
        { method: "PATCH", body: JSON.stringify(data) },
      );
      console.log(res);
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

  const tagHandler = (input: string) => {
    const split = input.split(" ");
    if (split.length > 1) {
      let newSplit: string[] = [];
      split.forEach((word) => {
        if (word[0] == "#" && word.length > 1) {
          setTags((prevTags) => [...prevTags, word]);
        } else {
          newSplit.push(word);
        }
      });
      setTagInputValue(newSplit.join());
    } else setTagInputValue(input);
  };

  const deleteTag = (idx: number) => {
    setTags((tags) => tags.filter((_, index) => index !== idx));
  };

  return (
    <div className="px-8 py-32 dark:text-white">
      <div className="text-center text-2xl tracking-wide">
        Edit a {props.post.category == "blog" ? "Blog" : "Project"}
      </div>
      <div className="flex h-full w-full justify-center">
        <form onSubmit={editPost} className="w-full md:w-3/4 lg:w-1/3 xl:w-1/2">
          <div className="input-group mx-4">
            <input
              value={postTitle.replaceAll("_", " ")}
              onChange={(e) => setPostTitle(e.target.value)}
              type="text"
              required
              name="title"
              placeholder=" "
              className="underlinedInput w-full bg-transparent"
            />
            <span className="bar"></span>
            <label className="underlinedInputLabel">Title</label>
          </div>
          <div className="input-group mx-4">
            <input
              ref={subtitleRef}
              type="text"
              name="subtitle"
              placeholder=" "
              defaultValue={props.post.subtitle ? props.post.subtitle : ""}
              className="underlinedInput w-full bg-transparent"
            />
            <span className="bar"></span>
            <label className="underlinedInputLabel">Subtitle</label>
          </div>
          <div className="pt-8 text-center text-xl">Banner</div>
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
              className="z-50 -ml-6 h-fit rounded-full"
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
            type={props.post.category}
            post={props.post}
            postTitle={postTitle || props.post.title}
          />

          <div className="-mx-6 md:-mx-36">
            <TextEditor
              updateContent={setEditorContent}
              preSet={props.post.body}
            />
          </div>
          <TagMaker
            tagInputValue={tagInputValue}
            tagHandler={tagHandler}
            tags={tags}
            deleteTag={deleteTag}
          />
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
          <div className="flex justify-end pb-2 pt-4">
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
                      props.post.category == "blog" ? "orange" : "blue"
                    }-400 dark:bg-${
                      props.post.category == "blog" ? "orange" : "blue"
                    }-600 hover:bg-${
                      props.post.category == "blog" ? "orange" : "blue"
                    }-500 dark:hover:bg-${
                      props.post.category == "blog" ? "orange" : "blue"
                    }-700`
                  : "bg-green-400 hover:bg-green-500 dark:bg-green-600 dark:hover:bg-green-700"
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
      <div className="mt-2 flex justify-center">
        <Link
          href={`${env.NEXT_PUBLIC_DOMAIN}/${
            props.post.category == "blog" ? "blog" : "projects"
          }/${postTitle?.replaceAll(" ", "_") || props.post.title}`}
          className="rounded border border-blue-500 bg-blue-400 px-4 py-2 text-white shadow-md transition-all duration-300  ease-in-out hover:bg-blue-500 active:scale-90 dark:border-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
        >
          Go to Post
        </Link>
      </div>
    </div>
  );
}
