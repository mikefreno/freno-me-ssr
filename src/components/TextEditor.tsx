"use client";
import "@/styles/content.scss";
import {
  BubbleMenu,
  EditorContent,
  FloatingMenu,
  useEditor,
  ReactNodeViewRenderer,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import Image from "@tiptap/extension-image";
import React, { useCallback } from "react";
import css from "highlight.js/lib/languages/css";
import js from "highlight.js/lib/languages/javascript";
import ts from "highlight.js/lib/languages/typescript";
import { lowlight } from "lowlight";

lowlight.registerLanguage("css", css);
lowlight.registerLanguage("js", js);
lowlight.registerLanguage("ts", ts);

import CodeBlockComponent from "./CodeBlockComponent";

export default function TextEditor({ updateContent, preSet }: any) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      CodeBlockLowlight.extend({
        addNodeView() {
          return ReactNodeViewRenderer(CodeBlockComponent);
        },
      }).configure({ lowlight }),
      Link.configure({
        openOnClick: true,
      }),
      Image,
    ],
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

  const setLink = useCallback(() => {
    if (!editor) {
      return null;
    }
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);

    // cancelled
    if (url === null) {
      return;
    }

    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();

      return;
    }

    // update link
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  const addImage = useCallback(() => {
    if (!editor) {
      return null;
    }
    const url = window.prompt("URL");

    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

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
            onClick={setLink}
            className={`${
              editor.isActive("link") ? "bg-white" : "hover:bg-white"
            } mx-1 bg-opacity-30 hover:bg-opacity-30 rounded p-1`}
          >
            Set Link
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
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            disabled={!editor.can().chain().focus().toggleCodeBlock().run()}
            className={`${
              editor.isActive("codeBlock") ? "bg-white" : "hover:bg-white"
            } mx-1 bg-opacity-30 hover:bg-opacity-30 rounded p-1`}
          >
            Code Block
          </button>
        </FloatingMenu>
      )}
      <EditorContent
        editor={editor}
        className="w-full ProseMirror dark:text-white rounded-md border px-4 py-2 border-black dark:border-white"
      />
    </div>
  );
}
