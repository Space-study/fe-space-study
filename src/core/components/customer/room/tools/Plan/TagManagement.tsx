/* eslint-disable @typescript-eslint/no-explicit-any */
import {Button} from '@/core/components/ui/button'
import {Card, CardContent, CardHeader} from '@/core/components/ui/card'
import {Checkbox} from '@/core/components/ui/checkbox'
import {Input} from '@/core/components/ui/input'
import {Label} from '@/core/components/ui/label'
import {RadioGroup, RadioGroupItem} from '@/core/components/ui/radio-group'
import {labelService} from '@src/core/services/plan/label'
import {Plus, Search, Trash2} from 'lucide-react'
import React, {useEffect, useState} from 'react'

interface Tag {
  id: number
  name: string
  emoji: string
  color?: string
  isDefault?: boolean
}

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void
  onClose: () => void
}

interface TagCreatorProps {
  onCreateTag: (tag: Omit<Tag, 'id'>) => void
  onClose: () => void
}

const emojiData = {
  frequentlyUsed: ['👍', '😊', '😂', '😍', '😔', '😊', '😄', '😂', '😭'],
  smileysAndPeople: [
    '😀',
    '😃',
    '😄',
    '😁',
    '😆',
    '😅',
    '😂',
    '🤣',
    '😊',
    '😇',
    '🙂',
    '🙃',
    '😉',
    '😌',
    '😍',
    '🥰',
    '😘',
    '😗',
    '😙',
    '😚',
    '😋',
    '😛',
    '😝',
    '😜',
    '🤪',
    '🤨',
    '🧐',
    '🤓',
    '😎',
    '🤩',
    '🥳',
    '😏',
    '😒',
    '😞',
    '😔',
    '😟',
  ],
}

const colors = [
  {name: 'Grey', value: 'grey'},
  {name: 'Green', value: 'green'},
  {name: 'Blue', value: 'blue'},
  {name: 'Brown', value: 'brown'},
  {name: 'Orange', value: 'orange'},
  {name: 'Yellow', value: 'yellow'},
  {name: 'Pink', value: 'pink'},
  {name: 'Purple', value: 'purple'},
] as const

type ColorType = (typeof colors)[number]['value']

const EmojiPicker: React.FC<EmojiPickerProps> = ({onEmojiSelect, onClose}) => {
  const [searchTerm, setSearchTerm] = useState('')

  return (
    <Card className='absolute z-50 w-64 bg-white shadow-lg'>
      <CardHeader className='p-2'>
        <div className='relative'>
          <Search className='absolute left-2 top-2.5 h-4 w-4 text-gray-400' />
          <Input
            placeholder='Search'
            className='pl-8'
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent className='p-2'>
        <div className='space-y-4'>
          <div>
            <h3 className='mb-2 text-sm font-medium'>Frequently used</h3>
            <div className='grid grid-cols-8 gap-1'>
              {emojiData.frequentlyUsed.map((emoji, index) => (
                <button
                  key={index}
                  onClick={() => {
                    onEmojiSelect(emoji)
                    onClose()
                  }}
                  className='p-1 hover:bg-gray-100 rounded'>
                  {emoji}
                </button>
              ))}
            </div>
          </div>
          <div>
            <h3 className='mb-2 text-sm font-medium'>Smileys & People</h3>
            <div className='grid grid-cols-8 gap-1'>
              {emojiData.smileysAndPeople.map((emoji, index) => (
                <button
                  key={index}
                  onClick={() => {
                    onEmojiSelect(emoji)
                    onClose()
                  }}
                  className='p-1 hover:bg-gray-100 rounded'>
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

const TagCreator: React.FC<TagCreatorProps> = ({onCreateTag, onClose}) => {
  const [tagName, setTagName] = useState('')
  const [selectedEmoji, setSelectedEmoji] = useState('✏️')
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [isDefault, setIsDefault] = useState(false)
  const [selectedColor, setSelectedColor] = useState<ColorType>('grey')

  const handleCreate = () => {
    if (tagName.trim()) {
      onCreateTag({
        name: tagName.trim(),
        emoji: selectedEmoji,
        color: selectedColor,
        isDefault,
      })
      setTagName('')
      onClose()
    }
  }

  return (
    <Card className='w-full'>
      <CardContent className='p-4'>
        <div className='flex justify-between items-center mb-4'>
          <div className='font-medium'>Emoji</div>
          <Button variant='ghost' size='icon' onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
            {selectedEmoji}
          </Button>
          {showEmojiPicker && (
            <div className='absolute mt-2'>
              <EmojiPicker
                onEmojiSelect={emoji => {
                  setSelectedEmoji(emoji)
                  setShowEmojiPicker(false)
                }}
                onClose={() => setShowEmojiPicker(false)}
              />
            </div>
          )}
        </div>

        <Input
          type='text'
          placeholder='Tag name'
          value={tagName}
          onChange={e => setTagName(e.target.value)}
          className='mb-4'
        />

        <div className='flex items-center space-x-2 mb-4'>
          <Checkbox
            id='default'
            checked={isDefault}
            onCheckedChange={checked => setIsDefault(checked as boolean)}
          />
          <Label htmlFor='default'>Set as default</Label>
        </div>

        <RadioGroup
          value={selectedColor}
          onValueChange={value => setSelectedColor(value as ColorType)}>
          {colors.map(color => (
            <div key={color.value} className='flex items-center space-x-2'>
              <RadioGroupItem value={color.value} id={color.value} />
              <div className='w-4 h-4 rounded' style={{backgroundColor: color.value}} />
              <Label htmlFor={color.value}>{color.name}</Label>
            </div>
          ))}
        </RadioGroup>

        <Button onClick={handleCreate} className='w-full mt-4'>
          Create
        </Button>
      </CardContent>
    </Card>
  )
}

const TagManagement: React.FC = () => {
  const [tags, setTags] = useState<Tag[]>([])
  const [showTagCreator, setShowTagCreator] = useState(false)
  const [loading, setLoading] = useState(false)

  // Fetch labels from the API on component mount
  const fetchTags = async () => {
    setLoading(true)
    try {
      // Example: page 1, limit 100
      const response = await labelService.getPaginatedLabels({page: 1, limit: 100})
      // Assuming the response shape: { data: { items: Label[], total, page, limit } }
      const items = (response as any) || []
      // Map each label: split the name into emoji and tag name; description holds the color.
      const mappedTags: Tag[] = items.map((item: any) => {
        // Expect label name to be formatted as "emoji tagName", e.g., "😆 TagName"
        const parts = item.name.split(' ')
        let emoji = ''
        let name = item.name
        if (parts.length > 1 && /^[\u{1F300}-\u{1F6FF}]/u.test(parts[0])) {
          emoji = parts[0]
          name = parts.slice(1).join(' ')
        }
        return {
          id: item.id,
          name: name,
          emoji: emoji,
          color: item.description,
        }
      })
      setTags(mappedTags)
    } catch (error) {
      console.error('Failed to fetch tags:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTags()
  }, [])

  // Create a new label via the API and update state
  const handleCreateTag = async (newTag: Omit<Tag, 'id'>) => {
    try {
      // Combine emoji and name here for the API call
      const payload = {
        name: `${newTag.emoji} ${newTag.name}`,
        description: newTag.color || '',
      }
      const createdLabel = await labelService.createLabel(payload)

      // When mapping the response, split properly
      const parts = createdLabel.name.split(' ')
      const emoji = parts[0]
      const name = parts.slice(1).join(' ')

      const mappedTag: Tag = {
        id: createdLabel.id,
        name: name,
        emoji: emoji,
        color: createdLabel.description,
      }
      setTags(prev => [...prev, mappedTag])
    } catch (error) {
      console.error('Failed to create tag:', error)
    }
  }

  // Delete a label via the API and update state
  const handleDeleteTag = async (id: number) => {
    try {
      await labelService.deleteLabel(id)
      setTags(prev => prev.filter(tag => tag.id !== id))
    } catch (error) {
      console.error('Failed to delete tag:', error)
    }
  }

  return (
    <div>
      <div className='flex items-center justify-between mb-2'>
        <h2 className='font-semibold'>Tags</h2>
        <Button variant='ghost' size='icon' onClick={() => setShowTagCreator(!showTagCreator)}>
          <Plus className='h-4 w-4' />
        </Button>
      </div>

      {showTagCreator && (
        <TagCreator
          onCreateTag={async tag => {
            await handleCreateTag(tag)
            setShowTagCreator(false)
          }}
          onClose={() => setShowTagCreator(false)}
        />
      )}

      {loading ? (
        <p>Loading tags...</p>
      ) : (
        <div className='space-y-2'>
          <div className='flex items-center space-x-2'>
            <Checkbox id='all-tags' defaultChecked />
            <Label htmlFor='all-tags'>All</Label>
          </div>
          {tags.map(tag => (
            <div key={tag.id} className='flex items-center space-x-2'>
              <Checkbox id={`tag-${tag.id}`} />

              <div
                className='flex items-center px-2 py-1 rounded-lg text-white'
                style={{backgroundColor: tag.color}}>
                <span className='mr-1'>{tag.emoji}</span>
                <span>{tag.name}</span>
              </div>

              <Button variant='ghost' size='icon' onClick={() => handleDeleteTag(tag.id)}>
                <Trash2 className='h-4 w-4' />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default TagManagement
