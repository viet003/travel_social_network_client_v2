import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import { Icon } from '@iconify/react';

interface TiptapEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  maxLength?: number;
}

const TiptapEditor: React.FC<TiptapEditorProps> = ({
  content,
  onChange,
  placeholder = 'Bắt đầu viết...',
  maxLength = 2000
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3]
        }
      }),
      Placeholder.configure({
        placeholder
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline hover:text-blue-800'
        }
      })
    ],
    content,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      const text = editor.getText();
      if (text.length <= maxLength) {
        onChange(html);
      }
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none min-h-[150px] max-w-none p-4'
      }
    }
  });

  const charCount = editor?.storage.characterCount?.characters() || editor?.getText().length || 0;

  const toggleBold = () => editor?.chain().focus().toggleBold().run();
  const toggleItalic = () => editor?.chain().focus().toggleItalic().run();
  const toggleStrike = () => editor?.chain().focus().toggleStrike().run();
  const toggleBulletList = () => editor?.chain().focus().toggleBulletList().run();
  const toggleOrderedList = () => editor?.chain().focus().toggleOrderedList().run();
  const toggleBlockquote = () => editor?.chain().focus().toggleBlockquote().run();
  
  const setLink = () => {
    const url = window.prompt('URL');
    if (url) {
      editor?.chain().focus().setLink({ href: url }).run();
    }
  };

  const removeLink = () => editor?.chain().focus().unsetLink().run();

  if (!editor) {
    return null;
  }

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 bg-gray-50 border-b border-gray-200">
        <button
          type="button"
          onClick={toggleBold}
          className={`p-2 rounded hover:bg-gray-200 transition-colors ${
            editor.isActive('bold') ? 'bg-gray-300 text-blue-600' : 'text-gray-700'
          }`}
          title="Bold (Ctrl+B)"
        >
          <Icon icon="fluent:text-bold-24-filled" className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={toggleItalic}
          className={`p-2 rounded hover:bg-gray-200 transition-colors ${
            editor.isActive('italic') ? 'bg-gray-300 text-blue-600' : 'text-gray-700'
          }`}
          title="Italic (Ctrl+I)"
        >
          <Icon icon="fluent:text-italic-24-filled" className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={toggleStrike}
          className={`p-2 rounded hover:bg-gray-200 transition-colors ${
            editor.isActive('strike') ? 'bg-gray-300 text-blue-600' : 'text-gray-700'
          }`}
          title="Strikethrough"
        >
          <Icon icon="fluent:text-strikethrough-24-filled" className="w-4 h-4" />
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        <button
          type="button"
          onClick={toggleBulletList}
          className={`p-2 rounded hover:bg-gray-200 transition-colors ${
            editor.isActive('bulletList') ? 'bg-gray-300 text-blue-600' : 'text-gray-700'
          }`}
          title="Bullet List"
        >
          <Icon icon="fluent:text-bullet-list-24-filled" className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={toggleOrderedList}
          className={`p-2 rounded hover:bg-gray-200 transition-colors ${
            editor.isActive('orderedList') ? 'bg-gray-300 text-blue-600' : 'text-gray-700'
          }`}
          title="Numbered List"
        >
          <Icon icon="fluent:text-number-list-ltr-24-filled" className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={toggleBlockquote}
          className={`p-2 rounded hover:bg-gray-200 transition-colors ${
            editor.isActive('blockquote') ? 'bg-gray-300 text-blue-600' : 'text-gray-700'
          }`}
          title="Quote"
        >
          <Icon icon="fluent:text-quote-24-filled" className="w-4 h-4" />
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        {editor.isActive('link') ? (
          <button
            type="button"
            onClick={removeLink}
            className="p-2 rounded hover:bg-gray-200 transition-colors bg-gray-300 text-blue-600"
            title="Remove Link"
          >
            <Icon icon="fluent:link-dismiss-24-filled" className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={setLink}
            className="p-2 rounded hover:bg-gray-200 transition-colors text-gray-700"
            title="Add Link"
          >
            <Icon icon="fluent:link-24-filled" className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Editor Content */}
      <EditorContent editor={editor} />

      {/* Character Counter */}
      <div className="flex justify-end p-2 bg-gray-50 border-t border-gray-200">
        <span className={`text-xs ${charCount > maxLength ? 'text-red-500' : 'text-gray-500'}`}>
          {charCount}/{maxLength} ký tự
        </span>
      </div>
    </div>
  );
};

export default TiptapEditor;
