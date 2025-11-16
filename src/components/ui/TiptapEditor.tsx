import React, { useEffect, useRef, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { Icon } from '@iconify/react';
import { toast } from 'react-toastify';
import { apiUploadMedia } from '../../services/mediaService';

interface TiptapEditorProps {
  content: string;
  onChange: (content: string) => void;
  onMediaUpload?: (mediaId: string) => void;
  placeholder?: string;
  maxLength?: number;
  className?: string;
}

const TiptapEditor: React.FC<TiptapEditorProps> = ({
  content,
  onChange,
  onMediaUpload,
  placeholder = 'Bắt đầu viết...',
  maxLength = 2000,
  className = ''
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

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
      }),
      Image.configure({
        inline: true,
        allowBase64: true,
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg my-4'
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
        class: `prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none min-h-[150px] max-w-none p-4 ${className}`
      }
    }
  });

  // Update editor content when prop changes
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

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

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Vui lòng chọn file hình ảnh!');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Kích thước ảnh không được vượt quá 5MB!');
      return;
    }

    // Upload to server
    setIsUploading(true);
    try {
      const response = await apiUploadMedia(file, 'blog');
      const { mediaId, url } = response.data;
      
      // Insert image with server URL
      editor?.chain().focus().setImage({ src: url }).run();
      
      // Notify parent component about uploaded media
      if (onMediaUpload) {
        onMediaUpload(mediaId);
      }
      
      toast.success('Tải ảnh lên thành công!');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Không thể tải ảnh lên. Vui lòng thử lại!');
    } finally {
      setIsUploading(false);
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const addImageFromUrl = () => {
    const url = window.prompt('Nhập URL hình ảnh:');
    if (url) {
      editor?.chain().focus().setImage({ src: url }).run();
    }
  };

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

        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className={`p-2 rounded hover:bg-gray-200 transition-colors ${
            isUploading ? 'opacity-50 cursor-not-allowed' : 'text-gray-700'
          }`}
          title={isUploading ? "Đang tải ảnh lên..." : "Upload Image"}
        >
          {isUploading ? (
            <Icon icon="fluent:spinner-ios-20-filled" className="w-4 h-4 animate-spin" />
          ) : (
            <Icon icon="fluent:image-add-24-filled" className="w-4 h-4" />
          )}
        </button>

        <button
          type="button"
          onClick={addImageFromUrl}
          className="p-2 rounded hover:bg-gray-200 transition-colors text-gray-700"
          title="Insert Image URL"
        >
          <Icon icon="fluent:image-24-filled" className="w-4 h-4" />
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
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
