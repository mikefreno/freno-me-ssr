"use client";

import AddImageToS3 from "@/app/s3upload";
import Dropzone from "@/components/Dropzone";
import TextEditor from "@/components/TextEditor";
import XCircle from "@/icons/XCircle";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

export default function BlogCreation() {
  const [publish, setPublish] = useState<boolean>(false);
  const [bannerImage, setBannerImage] = useState<File | Blob>();
  const [bannerImageHolder, setBannerImageHolder] = useState<
    string | ArrayBuffer | null
  >(null);
  const [editorContent, setEditorContent] = useState<string>("");
  const [submitButtonLoading, setSubmitButtonLoading] =
    useState<boolean>(false);
  const router = useRouter();

  const titleRef = useRef<HTMLInputElement>(null);
  const subtitleRef = useRef<HTMLInputElement>(null);

  const handleBannerImageDrop = useCallback((acceptedFiles: Blob[]) => {
    acceptedFiles.forEach((file: Blob) => {
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

  const createBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitButtonLoading(true);
    if (titleRef.current) {
      let bannerImageKey = "";
      if (bannerImage) {
        bannerImageKey = await AddImageToS3(
          bannerImage,
          titleRef.current!.value,
          "blog"
        );
      }
      const data = {
        title: titleRef.current.value,
        subtitle: subtitleRef.current?.value,
        body: editorContent,
        embedded_link: null,
        banner_photo: bannerImageKey !== "" ? bannerImageKey : null,
        published: publish,
      };

      await fetch(
        `${process.env.NEXT_PUBLIC_DOMAIN}/api/database/blog/manipulation`,
        { method: "POST", body: JSON.stringify(data) }
      );

      router.push(`/blog/${titleRef.current.value}`);
    }

    setSubmitButtonLoading(false);
  };

  const removeImage = () => {
    setBannerImage(undefined);
    setBannerImageHolder(null);
  };

  return (
    <div className="px-8 py-32 dark:text-white">
      <div className="text-center text-2xl tracking-wide">Create a Blog</div>
      <div className="flex h-full w-full justify-center">
        <form
          onSubmit={createBlog}
          className="w-full md:w-3/4 lg:w-1/3 xl:w-1/2"
        >
          <div className="input-group mx-4">
            <input
              ref={titleRef}
              type="text"
              required
              name="title"
              placeholder=" "
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
              className="bg-transparent underlinedInput w-full"
            />
            <span className="bar"></span>
            <label className="underlinedInputLabel">Subtitle</label>
          </div>
          <div className="flex justify-center py-8">
            <Dropzone
              onDrop={handleBannerImageDrop}
              acceptedFiles={"image/jpg, image/jpeg, image/png"}
              fileHolder={bannerImageHolder}
              preSet={null}
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
          <div className="-mx-36">
            <TextEditor updateContent={setEditorContent} preSet={undefined} />
          </div>
          <div className="flex justify-end pt-4 pb-2">
            <input
              type="checkbox"
              className="my-auto"
              name="publish"
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
                  ? "bg-orange-400 dark:bg-orange-600 hover:bg-orange-500 dark:hover:bg-orange-700"
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
    </div>
  );
}
