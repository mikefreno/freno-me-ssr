"use client";

import {
  BubbleMenu,
  EditorContent,
  FloatingMenu,
  useEditor,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import React from "react";

export default function TextEditor({ updateContent, preSet }: any) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: preSet
      ? preSet
      : `
      <p>
        <em><b>Hello!</b> World</em>
      </p>
      <br/>
      <br/>
      <br/>
      <br/>
    `,
    onUpdate: ({ editor }) => {
      updateContent(editor.getHTML()); // Call updateContent with the new content
    },
  });

  return (
    <div className="flex justify-center w-full">
      {editor && (
        <BubbleMenu
          className="bg-black rounded text-white p-2 mt-4 w-fit whitespace-nowrap text-sm"
          tippyOptions={{ duration: 100 }}
          editor={editor}
        >
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`${
              editor.isActive("bold") ? "bg-white" : "hover:bg-white"
            } mx-1 bg-opacity-30 hover:bg-opacity-30 rounded p-1`}
          >
            Bold
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`${
              editor.isActive("italic") ? "bg-white" : "hover:bg-white"
            } mx-1 bg-opacity-30 hover:bg-opacity-30 rounded p-1`}
          >
            Italic
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={`${
              editor.isActive("strike") ? "bg-white" : "hover:bg-white"
            } mx-1 bg-opacity-30 hover:bg-opacity-30 rounded p-1`}
          >
            Strike
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`${
              editor.isActive("orderedList") ? "bg-white" : "hover:bg-white"
            } mx-1 bg-opacity-30 hover:bg-opacity-30 rounded p-1`}
          >
            Quotation
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleCode().run()}
            disabled={!editor.can().chain().focus().toggleCode().run()}
            className={`${
              editor.isActive("code") ? "bg-white" : "hover:bg-white"
            } mx-1 bg-opacity-30 hover:bg-opacity-30 rounded p-1`}
          >
            Code
          </button>
        </BubbleMenu>
      )}
      {editor && (
        <FloatingMenu
          className="bg-zinc-200 rounded text-black p-1 mt-4 w-fit whitespace-nowrap text-sm"
          tippyOptions={{ duration: 100 }}
          editor={editor}
        >
          <button
            type="button"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            className={`${
              editor.isActive("heading", { level: 1 })
                ? "bg-zinc-400"
                : "hover:bg-zinc-400"
            } mx-1 rounded p-1`}
          >
            H1
          </button>
          <button
            type="button"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            className={`${
              editor.isActive("heading", { level: 2 })
                ? "bg-zinc-400"
                : "hover:bg-zinc-400"
            } mx-1 rounded p-1`}
          >
            H2
          </button>
          <button
            type="button"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
            className={`${
              editor.isActive("heading", { level: 3 })
                ? "bg-zinc-400"
                : "hover:bg-zinc-400"
            } mx-1 rounded p-1`}
          >
            H3
          </button>
          <button
            type="button"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 4 }).run()
            }
            className={`${
              editor.isActive("heading", { level: 4 })
                ? "bg-zinc-400"
                : "hover:bg-zinc-400"
            } mx-1 rounded p-1`}
          >
            H4
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`${
              editor.isActive("bulletList")
                ? "bg-zinc-400"
                : "hover:bg-zinc-400"
            } mx-1 rounded p-1`}
          >
            <div className="whitespace-nowrap">Bullet-List</div>
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`${
              editor.isActive("orderedList")
                ? "bg-zinc-400"
                : "hover:bg-zinc-400"
            } mx-1 rounded p-1`}
          >
            <div className="whitespace-nowrap">Ordered-List</div>
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            className="mx-1 rounded p-1 hover:bg-zinc-400"
          >
            Horizontal-Rule
          </button>
        </FloatingMenu>
      )}
      <EditorContent
        editor={editor}
        className="w-full prose lg:prose-lg xl:prose-xl dark:prose-invert dark:text-white rounded-md border px-4 py-2 border-black dark:border-white"
      />
    </div>
  );
}
