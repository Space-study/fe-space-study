'use client'

import {cn} from '@src/lib/utils'
import Heading from '@tiptap/extension-heading'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import TextAlign from '@tiptap/extension-text-align'
import {EditorContent, useEditor} from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Heading1,
  Heading2,
  Heading3,
  ImageIcon,
  Italic,
  LinkIcon,
  List,
  ListOrdered,
} from 'lucide-react'
import {useEffect, useState} from 'react'
import {Button} from '../ui/button'

interface TiptapEditorProps {
  content: string
  onChange: (content: string) => void
}

export function TiptapEditor({content, onChange}: TiptapEditorProps) {
  // Add state to track client-side rendering
  const [isMounted, setIsMounted] = useState(false)

  // Set isMounted to true when component mounts (client-side only)
  useEffect(() => {
    setIsMounted(true)
  }, [])

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
      }),
      Heading.configure({
        levels: [1, 2, 3],
      }),
      Link.configure({
        openOnClick: false,
      }),
      Image,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content,
    onUpdate: ({editor}) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'min-h-[200px] border rounded-md p-4 focus:outline-none prose prose-sm max-w-none',
      },
    },
    // Set immediatelyRender to false to avoid hydration mismatches
    immediatelyRender: false,
  })

  // Make sure the editor is properly initialized
  useEffect(() => {
    if (editor && content && !editor.isEmpty) {
      editor.commands.setContent(content)
    }
  }, [editor, content])

  // Return null during SSR or before client-side hydration
  if (!isMounted) {
    return (
      <div className='border rounded-md'>
        <div className='flex flex-wrap gap-1 p-2 border-b bg-muted/50'>
          {/* Toolbar placeholder */}
          {Array(12)
            .fill(0)
            .map((_, i) => (
              <div key={i} className='w-8 h-8 rounded-md bg-muted/30'></div>
            ))}
        </div>
        <div className='min-h-[200px] border rounded-md p-4'>
          {/* Editor placeholder */}
          <div className='animate-pulse h-4 bg-muted/30 rounded w-3/4 mb-2'></div>
          <div className='animate-pulse h-4 bg-muted/30 rounded w-1/2 mb-2'></div>
          <div className='animate-pulse h-4 bg-muted/30 rounded w-2/3'></div>
        </div>
      </div>
    )
  }

  if (!editor) {
    return null
  }

  const addImage = () => {
    const url = window.prompt('Enter image URL')
    if (url) {
      editor.chain().focus().setImage({src: url}).run()
    }
  }

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href
    const url = window.prompt('URL', previousUrl)

    if (url === null) {
      return
    }

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }

    editor.chain().focus().extendMarkRange('link').setLink({href: url}).run()
  }

  return (
    <div className='border rounded-md'>
      <div className='flex flex-wrap gap-1 p-2 border-b bg-muted/50'>
        <Button
          variant='ghost'
          size='sm'
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={cn(editor.isActive('bold') ? 'bg-muted' : '')}
          type='button'>
          <Bold className='h-4 w-4' />
        </Button>
        <Button
          variant='ghost'
          size='sm'
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={cn(editor.isActive('italic') ? 'bg-muted' : '')}
          type='button'>
          <Italic className='h-4 w-4' />
        </Button>
        <Button
          variant='ghost'
          size='sm'
          onClick={() => editor.chain().focus().toggleHeading({level: 1}).run()}
          className={cn(editor.isActive('heading', {level: 1}) ? 'bg-muted' : '')}
          type='button'
          aria-label='Heading 1'>
          <Heading1 className='h-4 w-4' />
        </Button>
        <Button
          variant='ghost'
          size='sm'
          onClick={() => editor.chain().focus().toggleHeading({level: 2}).run()}
          className={cn(editor.isActive('heading', {level: 2}) ? 'bg-muted' : '')}
          type='button'
          aria-label='Heading 2'>
          <Heading2 className='h-4 w-4' />
        </Button>
        <Button
          variant='ghost'
          size='sm'
          onClick={() => editor.chain().focus().toggleHeading({level: 3}).run()}
          className={cn(editor.isActive('heading', {level: 3}) ? 'bg-muted' : '')}
          type='button'
          aria-label='Heading 3'>
          <Heading3 className='h-4 w-4' />
        </Button>
        <Button
          variant='ghost'
          size='sm'
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={cn(editor.isActive('bulletList') ? 'bg-muted' : '')}
          type='button'
          aria-label='Bullet List'>
          <List className='h-4 w-4' />
        </Button>
        <Button
          variant='ghost'
          size='sm'
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={cn(editor.isActive('orderedList') ? 'bg-muted' : '')}
          type='button'
          aria-label='Ordered List'>
          <ListOrdered className='h-4 w-4' />
        </Button>
        <Button
          variant='ghost'
          size='sm'
          onClick={setLink}
          className={cn(editor.isActive('link') ? 'bg-muted' : '')}
          type='button'
          aria-label='Add Link'>
          <LinkIcon className='h-4 w-4' />
        </Button>
        <Button variant='ghost' size='sm' onClick={addImage} type='button' aria-label='Add Image'>
          <ImageIcon className='h-4 w-4' />
        </Button>
        <Button
          variant='ghost'
          size='sm'
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={cn(editor.isActive({textAlign: 'left'}) ? 'bg-muted' : '')}
          type='button'
          aria-label='Align Left'>
          <AlignLeft className='h-4 w-4' />
        </Button>
        <Button
          variant='ghost'
          size='sm'
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={cn(editor.isActive({textAlign: 'center'}) ? 'bg-muted' : '')}
          type='button'
          aria-label='Align Center'>
          <AlignCenter className='h-4 w-4' />
        </Button>
        <Button
          variant='ghost'
          size='sm'
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={cn(editor.isActive({textAlign: 'right'}) ? 'bg-muted' : '')}
          type='button'
          aria-label='Align Right'>
          <AlignRight className='h-4 w-4' />
        </Button>
      </div>
      <EditorContent editor={editor} />
    </div>
  )
}
