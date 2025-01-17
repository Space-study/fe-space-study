import {Button} from '@/core/components/ui/button'
import {Card, CardContent, CardHeader} from '@/core/components/ui/card'
import {Checkbox} from '@/core/components/ui/checkbox'
import {Input} from '@/core/components/ui/input'
import {Label} from '@/core/components/ui/label'
import {RadioGroup, RadioGroupItem} from '@/core/components/ui/radio-group'
import {Plus, Search} from 'lucide-react'
import React, {useState} from 'react'

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
        name: tagName,
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
  const [tags, setTags] = useState<Tag[]>([
    {id: 1, name: 'haha', emoji: '😄'},
    {id: 2, name: 'home', emoji: '✏️'},
  ])
  const [showTagCreator, setShowTagCreator] = useState(false)

  const handleCreateTag = (newTag: Omit<Tag, 'id'>) => {
    setTags([...tags, {id: Date.now(), ...newTag}])
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
          onCreateTag={tag => {
            handleCreateTag(tag)
            setShowTagCreator(false)
          }}
          onClose={() => setShowTagCreator(false)}
        />
      )}

      <div className='space-y-2'>
        <div className='flex items-center space-x-2'>
          <Checkbox id='all-tags' defaultChecked />
          <Label htmlFor='all-tags'>All</Label>
        </div>
        {tags.map(tag => (
          <div key={tag.id} className='flex items-center space-x-2'>
            <Checkbox id={`tag-${tag.id}`} />
            <span>{tag.emoji}</span>
            <Label htmlFor={`tag-${tag.id}`}>{tag.name}</Label>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TagManagement
