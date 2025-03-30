'use client'

import {Alert, AlertDescription, AlertTitle} from '@/core/components/ui/alert'
import {Badge} from '@/core/components/ui/badge'
import {Button} from '@/core/components/ui/button'
import {Dialog, DialogContent, DialogHeader, DialogTitle} from '@/core/components/ui/dialog'
import {Input} from '@/core/components/ui/input'
import {Skeleton} from '@/core/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/core/components/ui/table'
import {Textarea} from '@/core/components/ui/textarea'
import {useUser} from '@src/app/shared/UserProvider'
import {IssueService} from '@src/core/services/issues/issue-service'
import {AlertCircle} from 'lucide-react'
import {useEffect, useState} from 'react'

interface IssueResponse {
  id: number
  reporter_id: number
  reason_title: string
  reason_description: string
  status: string
  created_at: string
  updatedAt: string
}

enum IssueStatus_Report {
  PENDING = 'pending',
  RESOLVED = 'resolved',
  REJECTED = 'rejected',
}

export default function ReportIssuesPage() {
  const {user} = useUser()
  const [issues, setIssues] = useState<IssueResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedIssue, setSelectedIssue] = useState<IssueResponse | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [editData, setEditData] = useState({reason_title: '', reason_description: ''})

  useEffect(() => {
    const fetchIssues = async () => {
      if (!user) return

      try {
        setLoading(true)
        const issueService = new IssueService()
        const {data, status} = await issueService.getIssues()

        if (status === 200 && data) {
          const userIssues = data.filter(issue => issue.reporter_id === user.id)
          setIssues(userIssues)
        } else {
          setError('Failed to fetch issues')
        }
      } catch (err) {
        setError('An error occurred while fetching your issues')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchIssues()
  }, [user])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case IssueStatus_Report.PENDING:
        return 'bg-yellow-500'
      case IssueStatus_Report.RESOLVED:
        return 'bg-green-500'
      case IssueStatus_Report.REJECTED:
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  const handleEditClick = (issue: IssueResponse) => {
    if (issue.status === IssueStatus_Report.PENDING) {
      setIsEditMode(true)
      setSelectedIssue(issue)
      setEditData({
        reason_title: issue.reason_title,
        reason_description: issue.reason_description,
      })
      setIsDialogOpen(true)
    }
  }

  const handleSaveEdit = async () => {
    if (!selectedIssue) return

    try {
      const issueService = new IssueService()
      const {status} = await issueService.updateIssue(selectedIssue.id, editData)

      if (status === 200) {
        setIssues(prev =>
          prev.map(issue => (issue.id === selectedIssue.id ? {...issue, ...editData} : issue)),
        )
        setIsDialogOpen(false)
        setSelectedIssue(null)
        setIsEditMode(false)
      } else {
        console.error('Failed to update issue')
      }
    } catch (err) {
      console.error('An error occurred while updating the issue:', err)
    }
  }

  if (loading) {
    return (
      <div className='container mx-auto py-8'>
        <h1 className='text-2xl font-bold mb-6'>My Reported Issues</h1>
        <div className='w-full'>
          <Skeleton className='h-10 w-full mb-2' />
          <Skeleton className='h-12 w-full mb-2' />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='container mx-auto py-8'>
        <h1 className='text-2xl font-bold mb-6'>My Reported Issues</h1>
        <Alert variant='destructive'>
          <AlertCircle className='h-4 w-4' />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className='container mx-auto py-8'>
      <h1 className='text-2xl font-bold mb-6 text-center'>My Reported Issues</h1>

      {issues.length === 0 ? (
        <div className='text-center py-12'>
          <p className='text-muted-foreground'>You have not reported any issues yet.</p>
        </div>
      ) : (
        <div className='rounded-md border mx-auto w-[800px]'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Issue Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date Reported</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {issues.map(issue => (
                <TableRow key={issue.id}>
                  <TableCell className='font-medium'>{issue.reason_title}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(issue.status)}>{issue.status}</Badge>
                  </TableCell>
                  <TableCell>{formatDate(issue.created_at)}</TableCell>
                  <TableCell>
                    {issue.status.toLowerCase() === 'pending' && (
                      <Button size='sm' onClick={() => handleEditClick(issue)}>
                        Edit
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        {selectedIssue && (
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{isEditMode ? 'Edit Issue' : selectedIssue.reason_title}</DialogTitle>
            </DialogHeader>
            {isEditMode ? (
              <div className='space-y-4'>
                <div>
                  <label htmlFor='reason_title' className='block text-sm font-medium text-gray-700'>
                    Title
                  </label>
                  <Input
                    id='reason_title'
                    value={editData.reason_title}
                    onChange={e => setEditData(prev => ({...prev, reason_title: e.target.value}))}
                  />
                </div>
                <div>
                  <label
                    htmlFor='reason_description'
                    className='block text-sm font-medium text-gray-700'>
                    Description
                  </label>
                  <Textarea
                    value={editData.reason_description}
                    onChange={e =>
                      setEditData(prev => ({...prev, reason_description: e.target.value}))
                    }
                    style={{
                      height: `${Math.min(600, Math.max(100, editData.reason_description.split('\n').length * 24))}px`,
                      overflow: 'auto',
                    }}
                  />
                </div>

                <div className='flex justify-end space-x-2'>
                  <Button variant='outline' onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveEdit}>Save</Button>
                </div>
              </div>
            ) : (
              <div>
                <p>{selectedIssue.reason_description}</p>
              </div>
            )}
          </DialogContent>
        )}
      </Dialog>
    </div>
  )
}
