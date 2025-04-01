'use client'

import {Avatar, AvatarFallback, AvatarImage} from '@/core/components/ui/avatar'
import {Badge} from '@/core/components/ui/badge'
import {Button} from '@/core/components/ui/button'
import {Card} from '@/core/components/ui/card'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/core/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/core/components/ui/dropdown-menu'
import {Input} from '@/core/components/ui/input'
import {Label} from '@/core/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/core/components/ui/select'
import {Separator} from '@/core/components/ui/separator'
import {Textarea} from '@/core/components/ui/textarea'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/core/components/ui/tooltip'
import {IssueStatus} from '@/core/enums/issue-status.enum'
import {
  IssueDetail as IssueDetailType,
  issueService,
  UpdateIssue,
} from '@src/core/services/plan/issues'
import {
  Bold,
  ChevronDown,
  ChevronRight,
  Clock,
  Code,
  FileCode,
  Image,
  Italic,
  LinkIcon,
  List,
  ListOrdered,
  Loader2,
  Maximize2,
  MessageSquare,
  MoreVertical,
  Plus,
  SmilePlus,
  Strikethrough,
  Table,
  ThumbsDown,
  ThumbsUp,
  Upload,
} from 'lucide-react'
import {useParams, useRouter} from 'next/navigation'
import {useEffect, useState} from 'react'
import {Controller, useForm} from 'react-hook-form'
import {toast} from 'sonner'

// Define form field types for the edit dialog
interface IssueFormValues {
  title: string
  description: string
  status: IssueStatus
  timeEstimate?: number
  timeSpent?: number
  assigneeId?: number
}

// Edit Issue Dialog Component
interface EditIssueDialogProps {
  issue: IssueDetailType
  onSave: (updatedIssue: UpdateIssue) => Promise<void>
}

const EditIssueDialog = ({issue, onSave}: EditIssueDialogProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    control,
    register,
    handleSubmit,
    formState: {errors},
  } = useForm<IssueFormValues>({
    defaultValues: {
      title: issue.title,
      description: issue.description,
      status: issue.status,
      timeEstimate: issue.timeEstimate,
      timeSpent: issue.timeSpent,
      assigneeId: issue.assignee?.id,
    },
  })

  const onSubmit = async (data: IssueFormValues) => {
    setIsSubmitting(true)
    try {
      await onSave(data)
      setIsOpen(false)
      toast.success('Issue updated successfully')
    } catch (error) {
      console.error('Error updating issue:', error)
      toast.error('Failed to update issue')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant='outline'>Edit</Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[525px]'>
        <DialogHeader>
          <DialogTitle>Edit Issue</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='grid gap-4 py-4'>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='title' className='text-right'>
                Title
              </Label>
              <Input
                id='title'
                className='col-span-3'
                {...register('title', {required: 'Title is required'})}
              />
              {errors.title && (
                <p className='col-span-3 col-start-2 text-sm text-red-500'>
                  {errors.title.message}
                </p>
              )}
            </div>

            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='status' className='text-right'>
                Status
              </Label>
              <div className='col-span-3'>
                <Controller
                  name='status'
                  control={control}
                  render={({field}) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder='Select status' />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(IssueStatus).map(status => (
                          <SelectItem key={status} value={status}>
                            {status.replace('_', ' ')}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>

            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='timeEstimate' className='text-right'>
                Time Estimate (h)
              </Label>
              <Input
                id='timeEstimate'
                type='number'
                min='0'
                step='0.5'
                className='col-span-3'
                {...register('timeEstimate', {
                  valueAsNumber: true,
                  min: {value: 0, message: 'Estimate must be positive'},
                })}
              />
              {errors.timeEstimate && (
                <p className='col-span-3 col-start-2 text-sm text-red-500'>
                  {errors.timeEstimate.message}
                </p>
              )}
            </div>

            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='timeSpent' className='text-right'>
                Time Spent (h)
              </Label>
              <Input
                id='timeSpent'
                type='number'
                min='0'
                step='0.5'
                className='col-span-3'
                {...register('timeSpent', {
                  valueAsNumber: true,
                  min: {value: 0, message: 'Time spent must be positive'},
                })}
              />
              {errors.timeSpent && (
                <p className='col-span-3 col-start-2 text-sm text-red-500'>
                  {errors.timeSpent.message}
                </p>
              )}
            </div>

            <div className='grid grid-cols-4 items-start gap-4'>
              <Label htmlFor='description' className='text-right pt-2'>
                Description
              </Label>
              <Textarea
                id='description'
                className='col-span-3'
                rows={5}
                {...register('description', {required: 'Description is required'})}
              />
              {errors.description && (
                <p className='col-span-3 col-start-2 text-sm text-red-500'>
                  {errors.description.message}
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type='button' variant='outline'>
                Cancel
              </Button>
            </DialogClose>
            <Button type='submit' disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default function IssueDetail() {
  const [issue, setIssue] = useState<IssueDetailType | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [thumbsUpCount, setThumbsUpCount] = useState(0)
  const [thumbsDownCount, setThumbsDownCount] = useState(0)

  const router = useRouter()
  const params = useParams()

  useEffect(() => {
    async function loadIssue() {
      setIsLoading(true)
      setError(null)

      try {
        const issueId = params?.id

        if (!issueId) {
          setError('No issue ID provided')
          setIsLoading(false)
          return
        }

        // Convert the issue ID to a number
        const numericId = Number(issueId)

        if (isNaN(numericId)) {
          setError('Invalid issue ID')
          setIsLoading(false)
          return
        }

        console.log(`Loading issue details for ID: ${numericId}`)
        const issueData = await issueService.getIssueById(numericId)
        setIssue(issueData)
      } catch (err) {
        console.error('Failed to load issue:', err)
        setError('Failed to load issue details. Please try again.')
        toast.error('Could not load issue details')
      } finally {
        setIsLoading(false)
      }
    }

    loadIssue()
  }, [params])

  const handleUpdateIssue = async (updatedIssue: UpdateIssue) => {
    if (!issue) return

    try {
      // Update the issue
      await issueService.updateIssue(issue.id, updatedIssue)

      // Reload the issue to get fresh data with the correct types
      const updatedIssueData = await issueService.getIssueById(issue.id)
      setIssue(updatedIssueData)

      toast.success('Issue updated successfully')
    } catch (error) {
      console.error('Error updating issue:', error)
      toast.error('Failed to update issue')
    }
  }

  const getStatusColor = (status: IssueStatus) => {
    switch (status) {
      case IssueStatus.OPEN:
        return 'bg-green-500'
      case IssueStatus.IN_PROGRESS:
        return 'bg-blue-500'
      case IssueStatus.CLOSED:
        return 'bg-gray-500'
      default:
        return 'bg-green-500'
    }
  }

  const formatDate = (date: Date) => {
    const now = new Date()
    const diffDays = Math.floor((now.getTime() - new Date(date).getTime()) / (1000 * 60 * 60 * 24))

    if (diffDays === 0) {
      return 'today'
    } else if (diffDays === 1) {
      return 'yesterday'
    } else {
      return `${diffDays} days ago`
    }
  }

  const formatTime = (hours: number) => {
    if (hours === 0) return '0h'
    if (hours < 1) return `${Math.round(hours * 60)}m`
    return `${hours}h`
  }

  const handleBackToBoard = () => {
    // Extract room ID from URL if available
    if (typeof window !== 'undefined') {
      const pathname = window.location.pathname
      const roomMatch = pathname.match(/\/room\/(\d+)/)
      if (roomMatch && roomMatch[1]) {
        const roomId = roomMatch[1]
        router.push(`/room/${roomId}/plan`)
        return
      }
    }

    // Fallback to just going back
    router.back()
  }

  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='flex flex-col items-center gap-2'>
          <Loader2 className='h-8 w-8 animate-spin text-primary' />
          <p>Loading issue details...</p>
        </div>
      </div>
    )
  }

  if (error || !issue) {
    return (
      <div className='flex flex-col items-center justify-center min-h-screen gap-4'>
        <div className='text-xl font-semibold text-red-500'>{error || 'Issue not found'}</div>
        <Button variant='outline' onClick={handleBackToBoard}>
          Back to Board
        </Button>
      </div>
    )
  }

  return (
    <div className='flex flex-col lg:flex-row gap-6 w-full max-w-7xl mx-auto p-4'>
      <div className='flex-1'>
        <div className='flex justify-between items-center mb-2'>
          <div className='flex items-center gap-2'>
            <Button variant='ghost' className='flex items-center gap-1' onClick={handleBackToBoard}>
              <ChevronDown className='h-4 w-4 rotate-90' />
              <span>Back</span>
            </Button>
            <h1 className='text-2xl font-bold'>{issue.title}</h1>
          </div>
          <div className='flex gap-2'>
            <EditIssueDialog issue={issue} onSave={handleUpdateIssue} />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='outline' size='icon'>
                  <MoreVertical className='h-4 w-4' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end'>
                <DropdownMenuItem>Delete issue</DropdownMenuItem>
                <DropdownMenuItem>Clone issue</DropdownMenuItem>
                <DropdownMenuItem>Move issue</DropdownMenuItem>
                <DropdownMenuItem>Change confidentiality</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className='flex items-center gap-2 mb-4'>
          <div className={`w-3 h-3 rounded-full ${getStatusColor(issue.status)}`}></div>
          <Badge variant='outline' className='capitalize'>
            {issue.status.toLowerCase()}
          </Badge>
          <span className='text-sm text-muted-foreground'>
            Issue created {formatDate(issue.createdAt)} by {issue.reporter?.username || 'Unknown'}
          </span>
        </div>

        <div className='flex gap-2 mb-6'>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant='outline'
                  size='sm'
                  className='flex items-center gap-1'
                  onClick={() => setThumbsUpCount(prev => prev + 1)}>
                  <ThumbsUp className='h-4 w-4' />
                  <span>{thumbsUpCount}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Like</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant='outline'
                  size='sm'
                  className='flex items-center gap-1'
                  onClick={() => setThumbsDownCount(prev => prev + 1)}>
                  <ThumbsDown className='h-4 w-4' />
                  <span>{thumbsDownCount}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Dislike</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant='outline' size='sm'>
                  <SmilePlus className='h-4 w-4' />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Add reaction</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Issue description */}
        <div className='mb-6 p-4 border rounded-md'>
          <p className='text-sm'>{issue.description}</p>
        </div>

        <Card className='p-4 mb-6 border-dashed border-2 flex flex-col items-center justify-center py-8'>
          <Upload className='h-6 w-6 mb-2 text-muted-foreground' />
          <p className='text-sm text-muted-foreground'>
            Drag your designs here or{' '}
            <Button variant='link' className='p-0 h-auto text-sm'>
              click to upload
            </Button>
            .
          </p>
        </Card>

        <div className='bg-muted rounded-md mb-6'>
          <div className='flex justify-between items-center p-3 bg-muted/80'>
            <div className='flex items-center gap-2'>
              <h3 className='font-medium'>Child items</h3>
              <Badge variant='secondary' className='text-xs'>
                0
              </Badge>
            </div>
            <div className='flex gap-2'>
              <Button variant='secondary' size='sm'>
                Add <ChevronDown className='ml-1 h-4 w-4' />
              </Button>
              <Button variant='ghost' size='icon'>
                <MoreVertical className='h-4 w-4' />
              </Button>
              <Button variant='ghost' size='icon'>
                <ChevronDown className='h-4 w-4' />
              </Button>
            </div>
          </div>
          <div className='p-4 text-sm text-muted-foreground'>
            No child items are currently assigned. Use child items to break down this issue into
            smaller parts.
          </div>
        </div>

        <div className='bg-muted rounded-md mb-6'>
          <div className='flex justify-between items-center p-3 bg-muted/80'>
            <div className='flex items-center gap-2'>
              <h3 className='font-medium'>Linked items</h3>
              <Badge variant='secondary' className='text-xs'>
                0
              </Badge>
            </div>
            <div className='flex gap-2'>
              <Button variant='secondary' size='sm'>
                Add
              </Button>
              <Button variant='ghost' size='icon'>
                <ChevronDown className='h-4 w-4' />
              </Button>
            </div>
          </div>
          <div className='p-4 text-sm text-muted-foreground'>
            Link issues together to show that they&apos;re related.{' '}
            <Button variant='link' className='p-0 h-auto text-sm'>
              Learn more
            </Button>
            .
          </div>
        </div>

        <div className='mb-6'>
          <div className='flex justify-between items-center mb-4'>
            <h2 className='text-xl font-bold'>Activity</h2>
            <Button variant='outline' size='sm'>
              Sort or filter <ChevronDown className='ml-1 h-4 w-4' />
            </Button>
          </div>

          <div className='border rounded-md'>
            <div className='flex items-center gap-2 p-2 border-b overflow-x-auto'>
              <Button variant='ghost' size='sm'>
                Preview
              </Button>
              <Separator orientation='vertical' className='h-5' />
              <Button variant='ghost' size='icon' className='h-8 w-8'>
                <Bold className='h-4 w-4' />
              </Button>
              <Button variant='ghost' size='icon' className='h-8 w-8'>
                <Italic className='h-4 w-4' />
              </Button>
              <Button variant='ghost' size='icon' className='h-8 w-8'>
                <Strikethrough className='h-4 w-4' />
              </Button>
              <Separator orientation='vertical' className='h-5' />
              <Button variant='ghost' size='icon' className='h-8 w-8'>
                <List className='h-4 w-4' />
              </Button>
              <Button variant='ghost' size='icon' className='h-8 w-8'>
                <ListOrdered className='h-4 w-4' />
              </Button>
              <Separator orientation='vertical' className='h-5' />
              <Button variant='ghost' size='icon' className='h-8 w-8'>
                <Code className='h-4 w-4' />
              </Button>
              <Button variant='ghost' size='icon' className='h-8 w-8'>
                <LinkIcon className='h-4 w-4' />
              </Button>
              <Separator orientation='vertical' className='h-5' />
              <Button variant='ghost' size='icon' className='h-8 w-8'>
                <Table className='h-4 w-4' />
              </Button>
              <Button variant='ghost' size='icon' className='h-8 w-8'>
                <Image className='h-4 w-4' />
              </Button>
              <Button variant='ghost' size='icon' className='h-8 w-8'>
                <FileCode className='h-4 w-4' />
              </Button>
              <Button variant='ghost' size='icon' className='h-8 w-8'>
                <MessageSquare className='h-4 w-4' />
              </Button>
              <div className='flex-1'></div>
              <Button variant='ghost' size='icon' className='h-8 w-8'>
                <Maximize2 className='h-4 w-4' />
              </Button>
            </div>
            <Textarea
              placeholder='Write a comment or drag your files here...'
              className='border-0 focus-visible:ring-0 resize-none min-h-[100px]'
            />
            <div className='p-2 border-t flex justify-between items-center'>
              <Button variant='link' size='sm' className='text-xs'>
                Switch to rich text editing
              </Button>
              <div className='text-xs text-muted-foreground'>Ctrl+Enter</div>
            </div>
          </div>
        </div>
      </div>

      <div className='w-full lg:w-80 space-y-6'>
        <div className='bg-white rounded-md p-4 border'>
          <Button variant='outline' className='w-full justify-between mb-4'>
            Add a to-do item <ChevronRight className='h-4 w-4' />
          </Button>

          <div className='space-y-4'>
            <div>
              <div className='flex justify-between items-center mb-1'>
                <h3 className='text-sm font-medium'>Assignees</h3>
                <Button variant='ghost' size='sm' className='h-6'>
                  Edit
                </Button>
              </div>
              <p className='text-sm text-muted-foreground'>None - assign yourself</p>
            </div>

            <div>
              <div className='flex justify-between items-center mb-1'>
                <h3 className='text-sm font-medium'>Epic</h3>
              </div>
              <div className='flex justify-between items-center'>
                <p className='text-sm text-muted-foreground'>This feature is locked.</p>
                <Button variant='link' size='sm' className='h-6 text-blue-500'>
                  Upgrade plan
                </Button>
              </div>
            </div>

            <div>
              <div className='flex justify-between items-center mb-1'>
                <h3 className='text-sm font-medium'>Labels</h3>
                <Button variant='ghost' size='sm' className='h-6'>
                  Edit
                </Button>
              </div>
              <p className='text-sm text-muted-foreground'>
                {issue.labels.length > 0
                  ? issue.labels.map(label => label.name).join(', ')
                  : 'None'}
              </p>
            </div>

            <div>
              <div className='flex justify-between items-center mb-1'>
                <h3 className='text-sm font-medium'>Milestone</h3>
                <Button variant='ghost' size='sm' className='h-6'>
                  Edit
                </Button>
              </div>
              <p className='text-sm text-muted-foreground'>None</p>
            </div>

            <div>
              <div className='flex justify-between items-center mb-1'>
                <h3 className='text-sm font-medium'>Weight</h3>
              </div>
              <div className='flex justify-between items-center'>
                <p className='text-sm text-muted-foreground'>This feature is locked.</p>
                <Button variant='link' size='sm' className='h-6 text-blue-500 flex items-center'>
                  Learn more <ChevronDown className='ml-1 h-3 w-3' />
                </Button>
              </div>
            </div>

            <div>
              <div className='flex justify-between items-center mb-1'>
                <h3 className='text-sm font-medium'>Due date</h3>
                <Button variant='ghost' size='sm' className='h-6'>
                  Edit
                </Button>
              </div>
              <p className='text-sm text-muted-foreground'>None</p>
            </div>

            <div>
              <div className='flex justify-between items-center mb-1'>
                <h3 className='text-sm font-medium'>Time tracking</h3>
                <div className='flex gap-1'>
                  <Button variant='ghost' size='icon' className='h-6 w-6'>
                    <Clock className='h-3 w-3' />
                  </Button>
                  <Button variant='ghost' size='icon' className='h-6 w-6'>
                    <Plus className='h-3 w-3' />
                  </Button>
                </div>
              </div>
              <div className='space-y-1'>
                {issue.timeEstimate > 0 && (
                  <div className='flex justify-between text-sm'>
                    <span className='text-muted-foreground'>Estimate:</span>
                    <span>{formatTime(issue.timeEstimate)}</span>
                  </div>
                )}
                {issue.timeSpent > 0 && (
                  <div className='flex justify-between text-sm'>
                    <span className='text-muted-foreground'>Spent:</span>
                    <span>{formatTime(issue.timeSpent)}</span>
                  </div>
                )}
                {issue.timeEstimate === 0 && issue.timeSpent === 0 && (
                  <p className='text-sm text-muted-foreground'>No estimate or time spent</p>
                )}
              </div>
            </div>

            <div>
              <div className='flex justify-between items-center mb-1'>
                <h3 className='text-sm font-medium'>Confidentiality</h3>
              </div>
              <p className='text-sm text-muted-foreground'>
                Confidentiality controls have moved to the issue actions menu (⋮) at the top of the
                page.
              </p>
            </div>

            <div>
              <div className='flex justify-between items-center mb-1'>
                <h3 className='text-sm font-medium'>
                  {issue.participants.length} Participant
                  {issue.participants.length !== 1 ? 's' : ''}
                </h3>
              </div>
              <div className='flex -space-x-2 mt-2'>
                {issue.participants.map(participant => (
                  <TooltipProvider key={participant.id}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Avatar className='h-8 w-8 border-2 border-background'>
                          <AvatarImage src={participant.avatar} alt={participant.username} />
                          <AvatarFallback>
                            {participant.username.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{participant.username}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </div>
            </div>

            <div>
              <div className='flex justify-between items-center mb-1'>
                <h3 className='text-sm font-medium'>Project</h3>
              </div>
              <p className='text-sm'>{issue.project.name}</p>
            </div>

            <div>
              <div className='flex justify-between items-center mb-1'>
                <h3 className='text-sm font-medium'>Created</h3>
              </div>
              <p className='text-sm text-muted-foreground'>
                {new Date(issue.createdAt).toLocaleDateString()} by {issue.reporter?.username}
              </p>
            </div>

            <div>
              <div className='flex justify-between items-center mb-1'>
                <h3 className='text-sm font-medium'>Updated</h3>
              </div>
              <p className='text-sm text-muted-foreground'>
                {new Date(issue.updatedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
