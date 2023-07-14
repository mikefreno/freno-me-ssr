"use client";
import Dropzone from "@/components/Dropzone";
import Navbar from "@/components/Navbar";
import UserDefaultImage from "@/icons/UserDefaultImage";
import Head from "next/head";
import { useCallback, useContext, useEffect, useState } from "react";

export default function Account() {
  const handleImageDrop = useCallback((acceptedFiles: Blob[]) => {
    acceptedFiles.forEach((file: Blob) => {
      // setImage(file);
      const ext = file.type.split("/")[1];
      if (ext) {
        // setImageExt(ext);
      } else {
        throw new Error("file extension not found");
      }

      const reader = new FileReader();
      reader.onload = () => {
        const str = reader.result;
        // setImageHolder(str);
      };
      reader.readAsDataURL(file);
    });
  }, []);

  // if (!currentUser) {
  //   return (
  //     <div className="flex h-screen w-screen justify-center">
  //       <AdjustableLoadingElement />
  //     </div>
  //   );
  // }

  return (
    <div className="bg-zinc-100 dark:bg-zinc-900">
      <Head>
        <title>Account | Freno.me</title>
        <meta name="description" content="User Account Page" />
      </Head>
      <Navbar />
      <div className="min-h-screen px-36">
        <div className="pt-24">
          <div className="flex w-full">
            <Dropzone
              onDrop={handleImageDrop}
              acceptedFiles={"image/jpg, image/jpeg, image/png"}
              fileHolder={null}
            />
          </div>
          <div className="text-xl">{}</div>
          <div className="text-lg">{}</div>
        </div>
      </div>
    </div>
  );
}
