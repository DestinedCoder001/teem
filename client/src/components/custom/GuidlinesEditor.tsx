import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Underline } from "@tiptap/extension-underline";
import { Bold } from "@tiptap/extension-bold";
import { Italic } from "@tiptap/extension-italic";
import { BulletList } from "@tiptap/extension-bullet-list";
import { OrderedList } from "@tiptap/extension-ordered-list";
import { Heading } from "@tiptap/extension-heading";
import { CharacterCount } from "@tiptap/extension-character-count";
import { useEffect } from "react";
import { type Control, useController } from "react-hook-form";
import { Button } from "../ui/button";

import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  List,
  ListOrdered,
} from "lucide-react";
import TextAlign from "@tiptap/extension-text-align";

type FormValues = {
  guidelines: string;
};

interface Props {
  name: keyof FormValues;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>;
  minCharacters: number;
  maxCharacters: number;
  className?:string;
}

const GuidelinesEditor = ({
  name,
  control,
  minCharacters,
  maxCharacters,
  className
}: Props) => {
  const {
    field: { value, onChange, onBlur, ref },
    fieldState: { error },
  } = useController({
    name,
    control,
    rules: {
      required: "Guidelines are required",
      validate: {
        minLength: (v) =>
          v && v.replace(/<[^>]*>/g, "").length >= minCharacters
            ? true
            : `Guidelines must be at least ${minCharacters} characters`,
        maxLength: (v) =>
          v && v.replace(/<[^>]*>/g, "").length <= maxCharacters
            ? true
            : `Guidelines must be less than ${maxCharacters} characters`,
      },
    },
  });

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bold: false,
        italic: false,
        underline: false,
        heading: false,
        bulletList: false,
        orderedList: false,
      }),
      Underline,
      Bold,
      Italic,
      BulletList,
      OrderedList,
      Heading.configure({
        levels: [1, 2, 3],
      }),
      CharacterCount.configure({
        limit: maxCharacters,
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    onBlur: () => {
      onBlur();
    },
    editorProps: {
      attributes: {
        class:
          "tiptap min-h-[150px] max-h-[300px] overflow-y-auto border-t bg-background rounded-b-md p-4 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring  disabled:cursor-not-allowed disabled:opacity-50 space-y-2 [&_h1]:text-2xl [&_h1]:font-bold [&_h2]:text-xl [&_h2]:font-semibold [&_h3]:text-lg [&_h3]:font-semibold [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:list-inside [&_ol]:list-inside",
      },
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "");
    }
  }, [value, editor]);

  return (
    <div className={className}>
    <div className="border border-slate-300 rounded-md">
      <div className="flex flex-wrap bg-slate-50 overflow-auto justify-center no-scrollbar gap-2 p-2 rounded-t-md">
        <Button
          variant="outline"
          type="button"
          onClick={() =>
            editor?.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={`px-3 py-1 rounded text-xs ${
            editor?.isActive("heading", { level: 1 }) ? "bg-secondary/20" : ""
          }`}
        >
          <span>
            H<sub>1</sub>
          </span>
        </Button>
        <Button
          variant="outline"
          type="button"
          onClick={() =>
            editor?.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={`px-3 py-1 rounded text-xs ${
            editor?.isActive("heading", { level: 2 }) ? "bg-secondary/20" : ""
          }`}
        >
          <span>
            H<sub>2</sub>
          </span>
        </Button>
        <Button
          variant="outline"
          type="button"
          onClick={() =>
            editor?.chain().focus().toggleHeading({ level: 3 }).run()
          }
          className={`px-3 py-1 rounded text-xs ${
            editor?.isActive("heading", { level: 3 }) ? "bg-secondary/20" : ""
          }`}
        >
          <span>
            H<sub>3</sub>
          </span>
        </Button>
        <Button
          variant="outline"
          type="button"
          onClick={() => editor?.chain().focus().toggleBold().run()}
          className={`px-4 py-1 font-bold rounded ${
            editor?.isActive("bold") ? "bg-secondary/20" : ""
          }`}
        >
          B
        </Button>
        <Button
          variant="outline"
          type="button"
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          className={`px-4 py-1 italic rounded ${
            editor?.isActive("italic") ? "bg-secondary/20" : ""
          }`}
        >
          I
        </Button>
        <Button
          variant="outline"
          type="button"
          onClick={() => editor?.chain().focus().toggleUnderline().run()}
          className={`px-4 py-1 underline rounded ${
            editor?.isActive("underline") ? "bg-secondary/20" : ""
          }`}
        >
          U
        </Button>
        <Button
          variant="outline"
          type="button"
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
          className={`px-3 py-1 rounded text-xs ${
            editor?.isActive("bulletList") ? "bg-secondary/20" : ""
          }`}
        >
          <List />
        </Button>
        <Button
          variant="outline"
          type="button"
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          className={`px-3 py-1 rounded text-xs ${
            editor?.isActive("orderedList") ? "bg-secondary/20" : ""
          }`}
        >
          <ListOrdered />
        </Button>
        <Button
          variant="outline"
          type="button"
          onClick={() => editor?.chain().focus().setTextAlign("left").run()}
          className={`px-3 py-1 rounded text-xs ${
            editor?.isActive({ textAlign: "left" }) ? "bg-secondary/20" : ""
          }`}
        >
          <AlignLeft />
        </Button>
        <Button
          variant="outline"
          type="button"
          onClick={() => editor?.chain().focus().setTextAlign("center").run()}
          className={`px-3 py-1 rounded text-xs ${
            editor?.isActive({ textAlign: "center" }) ? "bg-secondary/20" : ""
          }`}
        >
          <AlignCenter />
        </Button>
        <Button
          variant="outline"
          type="button"
          onClick={() => editor?.chain().focus().setTextAlign("right").run()}
          className={`px-3 py-1 rounded text-xs ${
            editor?.isActive({ textAlign: "right" }) ? "bg-secondary/20" : ""
          }`}
        >
          <AlignRight />
        </Button>
      </div>
      <EditorContent editor={editor} ref={ref} />
    </div>
      {error && <span className="text-xs text-red-500">{error.message}</span>}
    </div>
  );
};

export default GuidelinesEditor;
