"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Bold, Italic, List, ListOrdered, Heading1, Heading2, RotateCcw, RotateCw } from "lucide-react";
// isomorphic-dompurify can be used to sanitize HTML when displaying it, not needed strictly in the editor itself.

interface EditorProps {
    content: string;
    onChange: (html: string) => void;
}

export default function RichTextEditor({ content, onChange }: EditorProps) {
    const editor = useEditor({
        extensions: [StarterKit],
        content,
        immediatelyRender: false,
        editorProps: {
            attributes: {
                class: "prose prose-sm sm:prose-base focus:outline-none min-h-[200px] max-w-none px-4 py-3 leading-relaxed",
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });

    if (!editor) {
        return (
            <div className="border border-gray-300 rounded-md overflow-hidden bg-white animate-pulse">
                <div className="h-12 bg-gray-100 border-b border-gray-200"></div>
                <div className="h-48 bg-white"></div>
            </div>
        );
    }

    return (
        <div className="border border-gray-300 rounded-md overflow-hidden bg-white">
            {/* TOOLBAR */}
            <div className="flex flex-wrap items-center gap-1 border-b border-gray-200 bg-gray-50 p-2">
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive("bold") ? "bg-gray-200 text-blue-600" : "text-gray-700"}`}
                    title="Bold"
                >
                    <Bold size={18} />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive("italic") ? "bg-gray-200 text-blue-600" : "text-gray-700"}`}
                    title="Italic"
                >
                    <Italic size={18} />
                </button>
                <div className="w-px h-6 bg-gray-300 mx-1" />
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive("heading", { level: 2 }) ? "bg-gray-200 text-blue-600" : "text-gray-700"}`}
                    title="Heading 2"
                >
                    <Heading1 size={18} />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive("heading", { level: 3 }) ? "bg-gray-200 text-blue-600" : "text-gray-700"}`}
                    title="Heading 3"
                >
                    <Heading2 size={18} />
                </button>
                <div className="w-px h-6 bg-gray-300 mx-1" />
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive("bulletList") ? "bg-gray-200 text-blue-600" : "text-gray-700"}`}
                    title="Bullet List"
                >
                    <List size={18} />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive("orderedList") ? "bg-gray-200 text-blue-600" : "text-gray-700"}`}
                    title="Ordered List"
                >
                    <ListOrdered size={18} />
                </button>
                <div className="w-px h-6 bg-gray-300 mx-1" />
                <button
                    type="button"
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().undo()}
                    className="p-2 rounded hover:bg-gray-200 transition-colors text-gray-700 disabled:opacity-50"
                    title="Undo"
                >
                    <RotateCcw size={18} />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().redo()}
                    className="p-2 rounded hover:bg-gray-200 transition-colors text-gray-700 disabled:opacity-50"
                    title="Redo"
                >
                    <RotateCw size={18} />
                </button>
            </div>

            {/* EDITOR AREA */}
            <EditorContent editor={editor} className="bg-white text-gray-900" />
        </div>
    );
}
