
"use client";

import { useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";

type Props = {
  value: string;
  onChange: (html: string) => void;
};

const buttonStyle =
  "rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-sm font-bold hover:bg-fuchsia-600 disabled:opacity-40";

function prepareContent(value: string) {
  if (!value) return "<p></p>";

  if (/^\s*</.test(value)) return value;

  return value
    .split(/\n\s*\n/)
    .map((part) => `<p>${part
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\n/g, "<br>")}</p>`)
    .join("");
}

export default function ArticleEditor({
  value,
  onChange,
}: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        autolink: true,
        protocols: ["https", "http"],
        HTMLAttributes: {
          rel: "noopener noreferrer",
          target: "_blank",
        },
      }),
    ],
    content: prepareContent(value),
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "min-h-[350px] p-6 text-slate-200 leading-8 focus:outline-none",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) return;

    const current = editor.getHTML();
    const incoming = prepareContent(value);

    if (current !== incoming) {
      editor.commands.setContent(incoming, {
        emitUpdate: false,
      });
    }
    // Only resync when an external value changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, editor]);

  if (!editor) {
    return (
      <div className="rounded-xl border border-white/10 p-6 text-slate-400">
        Loading editor...
      </div>
    );
  }

  
function addLink() {
  if (!editor) return;

  const previous =
    editor.getAttributes("link").href || "";

  const url = window.prompt(
    "Enter link URL (https://...)",
    previous
  );

  if (url === null) return;

  if (!url.trim()) {
    editor.chain().focus().unsetLink().run();
    return;
  }

  try {
    const parsed = new URL(url.trim());

    if (!["http:", "https:"].includes(parsed.protocol)) {
      alert("Only HTTP and HTTPS links are allowed.");
      return;
    }

    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: parsed.toString() })
      .run();
  } catch {
    alert("Please enter a valid URL.");
  }
}

  return (
    <div className="overflow-hidden rounded-2xl border border-white/15 bg-black/40">
      <div className="flex flex-wrap gap-2 border-b border-white/10 p-3">
        <button
          type="button"
          className={buttonStyle}
          onClick={() =>
            editor.chain().focus().setParagraph().run()
          }
        >
          Paragraph
        </button>

        <button
          type="button"
          className={buttonStyle}
          onClick={() =>
            editor.chain().focus().toggleHeading({
              level: 2,
            }).run()
          }
        >
          H2
        </button>

        <button
          type="button"
          className={buttonStyle}
          onClick={() =>
            editor.chain().focus().toggleHeading({
              level: 3,
            }).run()
          }
        >
          H3
        </button>

        <button
          type="button"
          className={buttonStyle}
          onClick={() =>
            editor.chain().focus().toggleBold().run()
          }
        >
          Bold
        </button>

        <button
          type="button"
          className={buttonStyle}
          onClick={() =>
            editor.chain().focus().toggleItalic().run()
          }
        >
          Italic
        </button>

        <button
          type="button"
          className={buttonStyle}
          onClick={() =>
            editor.chain().focus().toggleBulletList().run()
          }
        >
          • List
        </button>

        <button
          type="button"
          className={buttonStyle}
          onClick={() =>
            editor.chain().focus().toggleOrderedList().run()
          }
        >
          1. List
        </button>

        <button
          type="button"
          className={buttonStyle}
          onClick={addLink}
        >
          Link
        </button>

        <button
          type="button"
          className={buttonStyle}
          onClick={() =>
            editor.chain().focus().undo().run()
          }
        >
          Undo
        </button>

        <button
          type="button"
          className={buttonStyle}
          onClick={() =>
            editor.chain().focus().redo().run()
          }
        >
          Redo
        </button>
      </div>

      <style>{`
        .jude-article-editor h2 {
          font-size: 1.6rem;
          font-weight: 800;
          margin: 1.5rem 0 0.75rem;
          color: #fff;
        }
        .jude-article-editor h3 {
          font-size: 1.25rem;
          font-weight: 700;
          margin: 1.2rem 0 0.6rem;
          color: #fff;
        }
        .jude-article-editor p {
          margin: 0.7rem 0;
        }
        .jude-article-editor ul {
          list-style: disc;
          padding-left: 1.6rem;
        }
        .jude-article-editor ol {
          list-style: decimal;
          padding-left: 1.6rem;
        }
        .jude-article-editor a {
          color: #67e8f9;
          text-decoration: underline;
        }
        .jude-article-editor blockquote {
          border-left: 3px solid #d946ef;
          padding-left: 1rem;
        }
      `}</style>

      <div className="jude-article-editor">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
