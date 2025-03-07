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
import ocaml from "highlight.js/lib/languages/ocaml";
import rust from "highlight.js/lib/languages/rust";
import { lowlight } from "lowlight";

lowlight.registerLanguage("css", css);
lowlight.registerLanguage("js", js);
lowlight.registerLanguage("ts", ts);
lowlight.registerLanguage("ocaml", ocaml);
lowlight.registerLanguage("rust", rust);

import CodeBlockComponent from "./CodeBlockComponent";

import { Node } from "@tiptap/core";

interface IframeOptions {
  allowFullscreen: boolean;
  HTMLAttributes: {
    [key: string]: any;
  };
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    iframe: {
      /**
       * Add an iframe
       */
      setIframe: (options: { src: string }) => ReturnType;
    };
  }
}

const IframeEmbed = Node.create<IframeOptions>({
  name: "iframe",

  group: "block",

  atom: true,

  addOptions() {
    return {
      allowFullscreen: true,
      HTMLAttributes: {
        class: "iframe-wrapper",
      },
    };
  },

  addAttributes() {
    return {
      src: {
        default: null,
      },
      frameborder: {
        default: 0,
      },
      allowfullscreen: {
        default: this.options.allowFullscreen,
        parseHTML: () => this.options.allowFullscreen,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "iframe",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["div", this.options.HTMLAttributes, ["iframe", HTMLAttributes]];
  },

  addCommands() {
    return {
      setIframe:
        (options: { src: string }) =>
        ({ tr, dispatch }) => {
          const { selection } = tr;
          const node = this.type.create(options);

          if (dispatch) {
            tr.replaceRangeWith(selection.from, selection.to, node);
          }

          return true;
        },
    };
  },
});

export default function TextEditor({ updateContent, preSet }: any) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      CodeBlockLowlight.extend({
        addNodeView() {
          //@ts-ignore
          return ReactNodeViewRenderer(CodeBlockComponent);
        },
      }).configure({ lowlight }),
      Link.configure({
        openOnClick: true,
      }),
      Image,
      IframeEmbed,
    ],
    content: preSet
      ? preSet
      : `
      <p>
        <em><b>Hello!</b> World</em>
      </p>
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

  const addIframe = () => {
    if (!editor) {
      return null;
    }
    const url = window.prompt("URL");
    if (url) {
      editor.commands.setIframe({ src: url });
    }
  };

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
    <div className="w-full rounded-md border border-black px-4 py-2 dark:border-white dark:text-white">
      {editor && (
        <BubbleMenu
          className="mt-4 w-fit whitespace-nowrap rounded bg-black p-2 text-sm text-white"
          tippyOptions={{ duration: 100 }}
          editor={editor}
        >
          <div className="w-64 overflow-x-scroll md:w-fit">
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
          </div>
        </BubbleMenu>
      )}
      {editor && (
        <FloatingMenu
          className="mt-4 w-fit whitespace-nowrap rounded bg-zinc-200 p-1 text-sm text-black"
          tippyOptions={{ duration: 100 }}
          editor={editor}
        >
          <div className="w-64 overflow-x-scroll md:w-fit">
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
            <button
              onClick={addImage}
              type="button"
              className="mx-1 rounded bg-opacity-30 p-1 hover:bg-opacity-30"
            >
              Add Image
            </button>
            <button
              onClick={addIframe}
              type="button"
              className="mx-1 rounded bg-opacity-30 p-1 hover:bg-opacity-30"
            >
              Add Iframe
            </button>
          </div>
        </FloatingMenu>
      )}
      <EditorContent
        editor={editor}
        className="prose prose-sm mx-auto min-w-full dark:prose-invert sm:prose-base dark:sm:prose-base md:prose-xl dark:md:prose-xl lg:prose-xl dark:lg:prose-xl xl:prose-2xl dark:xl:prose-2xl"
      />
    </div>
  );
}
