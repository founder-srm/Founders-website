'use client';

import { EditorProvider, useCurrentEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Redo2,
  Undo2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const MenuBar = () => {
  const { editor } = useCurrentEditor();

  if (!editor) return null;

  return (
    <div className="flex flex-wrap gap-2 p-2 border-b">
      <Button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={`px-2 py-1 rounded ${editor.isActive('bold') ? 'bg-slate-200' : ''}`}
        size="icon"
      >
        <Bold />
      </Button>
      <Button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`px-2 py-1 rounded ${editor.isActive('italic') ? 'bg-slate-200' : ''}`}
        size="icon"
      >
        <Italic />
      </Button>
      <Button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`px-2 py-1 rounded ${editor.isActive('bulletList') ? 'bg-slate-200' : ''}`}
        size="icon"
      >
        <List />
      </Button>
      <Button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`px-2 py-1 rounded ${editor.isActive('orderedList') ? 'bg-slate-200' : ''}`}
        size="icon"
      >
        <ListOrdered />
      </Button>
      <Button
        type="button"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`px-2 py-1 rounded ${editor.isActive('blockquote') ? 'bg-slate-200' : ''}`}
        size="icon"
      >
        <Quote />
      </Button>
      <Button
        type="button"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
        className="px-2 py-1 rounded "
        size="icon"
      >
        <Undo2 />
      </Button>
      <Button
        type="button"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
        className="px-2 py-1 rounded "
        size="icon"
      >
        <Redo2 />
      </Button>
    </div>
  );
};

const extensions = [
  StarterKit.configure({
    bulletList: {
      keepMarks: true,
      keepAttributes: false,
    },
    orderedList: {
      keepMarks: true,
      keepAttributes: false,
    },
  }),
];

const Tiptap = ({
  content = '<p>Hello World! 🌎️</p>',
  onUpdate,
}: {
  content: string;
  onUpdate?: (html: string) => void;
}) => {
  return (
    <div className="border rounded-md w-full min-h-32 max-h-64 overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-muted-foreground/20 [&::-webkit-scrollbar-track]:bg-transparent">
      <EditorProvider
        slotBefore={<MenuBar />}
        extensions={extensions}
        content={content}
        onUpdate={({ editor }) => {
          const html = editor.getHTML();
          onUpdate?.(html);
          // Maintain focus after content update
          editor.commands.focus();
        }}
        onCreate={({ editor }) => {
          onUpdate?.(editor.getHTML());
          // Set initial focus
          editor.commands.focus('end');
        }}
        editorProps={{
          attributes: {
            class:
              'prose prose-sm sm:prose-base lg:prose-lg m-5 focus:outline-none',
          },
          handleDOMEvents: {
            focus: (_view, event) => {
              // Prevent focus from being stolen
              event.preventDefault();
              return true;
            },
          },
        }}
      />
    </div>
  );
};

export default Tiptap;
