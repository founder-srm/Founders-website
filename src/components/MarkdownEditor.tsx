'use client';

import React from 'react';
import { EditorContent, useEditor, useEditorState, ReactNodeViewRenderer } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Highlight from '@tiptap/extension-highlight';
import Typography from '@tiptap/extension-typography';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { createLowlight } from 'lowlight';
import css from 'highlight.js/lib/languages/css';
import js from 'highlight.js/lib/languages/javascript';
import ts from 'highlight.js/lib/languages/typescript';
import html from 'highlight.js/lib/languages/xml';
import python from 'highlight.js/lib/languages/python';
import bash from 'highlight.js/lib/languages/bash';
import json from 'highlight.js/lib/languages/json';
import CodeBlockComponent from './CodeBlockComponent';
import { Button } from '@/components/ui/button';
import { 
  Bold, 
  Italic, 
  Strikethrough, 
  Code, 
  Code2,
  Heading1, 
  Heading2, 
  Heading3,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Highlighter
} from 'lucide-react';
import { Toggle } from '@/components/ui/toggle';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

// Create lowlight instance with common languages
const lowlight = createLowlight();
lowlight.register('html', html);
lowlight.register('css', css);
lowlight.register('js', js);
lowlight.register('javascript', js);
lowlight.register('ts', ts);
lowlight.register('typescript', ts);
lowlight.register('python', python);
lowlight.register('bash', bash);
lowlight.register('json', json);

interface MarkdownEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
}

const MarkdownEditor = React.memo(function MarkdownEditor({ 
  content, 
  onChange, 
  placeholder = "Start writing your blog post...",
  className 
}: MarkdownEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
        codeBlock: false, // Disable default code block to use lowlight version
      }),
      Highlight.configure({
        multicolor: false,
      }),
      Typography,
      CodeBlockLowlight.extend({
        addNodeView() {
          return ReactNodeViewRenderer(CodeBlockComponent);
        },
      }).configure({ lowlight }),
    ],
    content,
    immediatelyRender: false,
    shouldRerenderOnTransaction: false, // Optimize rendering performance
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: cn(
          'prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[400px] p-4',
          className
        ),
      },
    },
  });

  // Use selective editor state to minimize re-renders
  const editorState = useEditorState({
    editor,
    selector: (ctx) => {
      if (!ctx.editor) return null;
      
      return {
        isBold: ctx.editor.isActive('bold'),
        isItalic: ctx.editor.isActive('italic'),
        isStrike: ctx.editor.isActive('strike'),
        isCode: ctx.editor.isActive('code'),
        isCodeBlock: ctx.editor.isActive('codeBlock'),
        isHighlight: ctx.editor.isActive('highlight'),
        isHeading1: ctx.editor.isActive('heading', { level: 1 }),
        isHeading2: ctx.editor.isActive('heading', { level: 2 }),
        isHeading3: ctx.editor.isActive('heading', { level: 3 }),
        isBulletList: ctx.editor.isActive('bulletList'),
        isOrderedList: ctx.editor.isActive('orderedList'),
        isBlockquote: ctx.editor.isActive('blockquote'),
        canUndo: ctx.editor.can().chain().focus().undo().run(),
        canRedo: ctx.editor.can().chain().focus().redo().run(),
      };
    },
    equalityFn: (prev, next) => {
      if (!prev && !next) return true;
      if (!prev || !next) return false;
      
      return (
        prev.isBold === next.isBold &&
        prev.isItalic === next.isItalic &&
        prev.isStrike === next.isStrike &&
        prev.isCode === next.isCode &&
        prev.isCodeBlock === next.isCodeBlock &&
        prev.isHighlight === next.isHighlight &&
        prev.isHeading1 === next.isHeading1 &&
        prev.isHeading2 === next.isHeading2 &&
        prev.isHeading3 === next.isHeading3 &&
        prev.isBulletList === next.isBulletList &&
        prev.isOrderedList === next.isOrderedList &&
        prev.isBlockquote === next.isBlockquote &&
        prev.canUndo === next.canUndo &&
        prev.canRedo === next.canRedo
      );
    },
  });

  // Update content when prop changes
  React.useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [editor, content]);

  if (!editor) {
    return null;
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="border-b bg-muted/50 p-2 flex flex-wrap items-center gap-1">
        {/* Text Formatting */}
        <Toggle
          pressed={editorState?.isBold || false}
          onPressedChange={() => editor.chain().focus().toggleBold().run()}
          size="sm"
          aria-label="Bold"
        >
          <Bold className="h-4 w-4" />
        </Toggle>
        
        <Toggle
          pressed={editorState?.isItalic || false}
          onPressedChange={() => editor.chain().focus().toggleItalic().run()}
          size="sm"
          aria-label="Italic"
        >
          <Italic className="h-4 w-4" />
        </Toggle>
        
        <Toggle
          pressed={editorState?.isStrike || false}
          onPressedChange={() => editor.chain().focus().toggleStrike().run()}
          size="sm"
          aria-label="Strikethrough"
        >
          <Strikethrough className="h-4 w-4" />
        </Toggle>
        
        <Toggle
          pressed={editorState?.isCode || false}
          onPressedChange={() => editor.chain().focus().toggleCode().run()}
          size="sm"
          aria-label="Code"
        >
          <Code className="h-4 w-4" />
        </Toggle>

        <Toggle
          pressed={editorState?.isCodeBlock || false}
          onPressedChange={() => editor.chain().focus().toggleCodeBlock().run()}
          size="sm"
          aria-label="Code Block"
        >
          <Code2 className="h-4 w-4" />
        </Toggle>

        <Toggle
          pressed={editorState?.isHighlight || false}
          onPressedChange={() => editor.chain().focus().toggleHighlight().run()}
          size="sm"
          aria-label="Highlight"
        >
          <Highlighter className="h-4 w-4" />
        </Toggle>

        <Separator orientation="vertical" className="h-6" />

        {/* Headings */}
        <Toggle
          pressed={editorState?.isHeading1 || false}
          onPressedChange={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          size="sm"
          aria-label="Heading 1"
        >
          <Heading1 className="h-4 w-4" />
        </Toggle>
        
        <Toggle
          pressed={editorState?.isHeading2 || false}
          onPressedChange={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          size="sm"
          aria-label="Heading 2"
        >
          <Heading2 className="h-4 w-4" />
        </Toggle>
        
        <Toggle
          pressed={editorState?.isHeading3 || false}
          onPressedChange={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          size="sm"
          aria-label="Heading 3"
        >
          <Heading3 className="h-4 w-4" />
        </Toggle>

        <Separator orientation="vertical" className="h-6" />

        {/* Lists */}
        <Toggle
          pressed={editorState?.isBulletList || false}
          onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
          size="sm"
          aria-label="Bullet List"
        >
          <List className="h-4 w-4" />
        </Toggle>
        
        <Toggle
          pressed={editorState?.isOrderedList || false}
          onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
          size="sm"
          aria-label="Ordered List"
        >
          <ListOrdered className="h-4 w-4" />
        </Toggle>

        <Toggle
          pressed={editorState?.isBlockquote || false}
          onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}
          size="sm"
          aria-label="Quote"
        >
          <Quote className="h-4 w-4" />
        </Toggle>

        <Separator orientation="vertical" className="h-6" />

        {/* History */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editorState?.canUndo}
          aria-label="Undo"
        >
          <Undo className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editorState?.canRedo}
          aria-label="Redo"
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>

      {/* Editor Content */}
      <div className="min-h-[400px]">
        <EditorContent 
          editor={editor} 
          placeholder={placeholder}
        />
      </div>

      {/* Help Text */}
      <div className="border-t bg-muted/30 p-2 text-xs text-muted-foreground">
        <p>
          <strong>Markdown shortcuts:</strong> Use # for headings, * for bold, _ for italic, 
          ` for code, {'>'}  for quotes, - or * for lists. Type == to highlight text.
        </p>
      </div>
    </div>
  );
});

export default MarkdownEditor;
