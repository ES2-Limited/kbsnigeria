// Minimal Tiptap editor for admin content forms.

import Image from '@tiptap/extension-image'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { ImageIcon, List, ListOrdered, Pilcrow, Type, Bold, Italic } from 'lucide-react'
import { useEffect, useState } from 'react'
import Button from './Button'
import { cn } from '../../lib/cn'

function ToolbarButton({ active, children, onClick, title }) {
  return (
    <button
      className={cn(
        'inline-flex h-10 min-w-10 items-center justify-center rounded-lg border px-3 text-sm transition-colors duration-200',
        active ? 'border-brand-primary bg-brand-primary text-white' : 'border-brand-gray/30 bg-white text-text-secondary hover:text-brand-primary',
      )}
      onClick={onClick}
      title={title}
      type="button"
    >
      {children}
    </button>
  )
}

function RichTextEditor({ content = '', onChange }) {
  const [imageError, setImageError] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3],
        },
      }),
      Image,
    ],
    content,
    editorProps: {
      attributes: {
        class:
          'min-h-[240px] rounded-b-2xl border border-t-0 border-brand-gray/30 px-4 py-4 font-body text-text-primary outline-none prose prose-sm max-w-none focus:border-brand-primary',
      },
    },
    onUpdate: ({ editor: nextEditor }) => {
      onChange(nextEditor.getHTML())
    },
  })

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content || '<p></p>', false)
    }
  }, [content, editor])

  if (!editor) {
    return <div className="min-h-[300px] animate-pulse rounded-2xl bg-bg-light" />
  }

  const addImage = () => {
    const trimmedUrl = imageUrl.trim()

    if (!trimmedUrl) {
      return
    }

    // Only allow secure image sources — blocks javascript: and other schemes.
    if (!trimmedUrl.startsWith('https://')) {
      setImageError('Only secure https:// image URLs can be embedded.')
      return
    }

    setImageError('')
    editor.chain().focus().setImage({ src: trimmedUrl }).run()
    setImageUrl('')
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2 rounded-t-2xl border border-b-0 border-brand-gray/30 bg-bg-light p-3">
        <ToolbarButton active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()} title="Bold">
          <Bold className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()} title="Italic">
          <Italic className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton active={editor.isActive('heading', { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} title="Heading 2">
          <Type className="h-4 w-4" />
          <span className="ml-1 text-xs">H2</span>
        </ToolbarButton>
        <ToolbarButton active={editor.isActive('heading', { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} title="Heading 3">
          <Type className="h-4 w-4" />
          <span className="ml-1 text-xs">H3</span>
        </ToolbarButton>
        <ToolbarButton active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()} title="Bullet list">
          <List className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()} title="Numbered list">
          <ListOrdered className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton active={editor.isActive('paragraph')} onClick={() => editor.chain().focus().setParagraph().run()} title="Paragraph">
          <Pilcrow className="h-4 w-4" />
        </ToolbarButton>
      </div>

      <EditorContent editor={editor} />

      <div className="mt-3 flex flex-col gap-3 sm:flex-row">
        <input
          className="w-full rounded-xl border border-brand-gray/30 px-4 py-3 font-body text-text-primary outline-none transition-all duration-200 focus:border-brand-primary focus:ring-2 focus:ring-brand-accent/20"
          onChange={(event) => setImageUrl(event.target.value)}
          placeholder="Paste image URL to embed"
          type="url"
          value={imageUrl}
        />
        <Button onClick={addImage} variant="secondary">
          <ImageIcon className="h-4 w-4" />
          <span>Embed Image</span>
        </Button>
        {imageError ? (
          <p className="font-body text-sm text-red-600 sm:w-full" role="alert">
            {imageError}
          </p>
        ) : null}
      </div>
    </div>
  )
}

export default RichTextEditor
