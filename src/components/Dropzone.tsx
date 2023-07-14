"use client";
/* eslint-disable @next/next/no-img-element */
import React from "react";
import { useDropzone } from "react-dropzone";

const Dropzone = ({ onDrop, accept, fileHolder, preSet }: any) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxFiles: 100,
  });
  return (
    <div
      className={`z-10 my-4 flex border
      } border-dashed border-zinc-700 bg-transparent shadow-xl dark:border-zinc-100`}
      {...getRootProps()}
    >
      <label
        htmlFor="upload"
        className="flex h-48 w-48 cursor-pointer items-center justify-center"
      >
        <input className="dropzone-input" {...getInputProps()} />
        {(fileHolder !== null || preSet !== null) && !isDragActive ? (
          <div>
            {!fileHolder && preSet == "userDefault" ? (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="mx-auto h-12 w-12"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                  />
                </svg>
                <span
                  id="drop"
                  className="text-md text-zinc-700 dark:text-zinc-400"
                >
                  Upload Image
                  <br />
                  <span className="text-sm">Click or drag</span>
                </span>
              </>
            ) : (
              <img
                src={fileHolder == null ? preSet : fileHolder}
                className="h-32 w-32 rounded-full"
                alt="upload"
              />
            )}
          </div>
        ) : isDragActive ? (
          <div className="-mt-12">Drop File!</div>
        ) : (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 fill-transparent stroke-zinc-700 dark:stroke-zinc-400"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <span
              id="drop"
              className="text-md text-zinc-700 dark:text-zinc-400"
            >
              Upload Image
              <br />
              <span className="text-sm">Click or drag</span>
            </span>
          </>
        )}
      </label>
    </div>
  );
};

export default Dropzone;
