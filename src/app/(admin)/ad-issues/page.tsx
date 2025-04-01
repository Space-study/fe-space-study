'use client'

import {Alert, AlertDescription, AlertTitle} from '@/core/components/ui/alert'
import {Badge} from '@/core/components/ui/badge'
import {Button} from '@/core/components/ui/button'
import {Dialog, DialogContent, DialogHeader, DialogTitle} from '@/core/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/core/components/ui/select'
import {Skeleton} from '@/core/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/core/components/ui/table'
import {IssueService} from '@src/core/services/issues/issue-service'
import {AlertCircle} from 'lucide-react'
import {useEffect, useState} from 'react'

interface IssueResponse {
  report_id: number
  reporter_id: number
  reason_title: string
  reason_description: string
  status: string
  created_at: string
  updated_at: string
}

enum IssueStatus_Report {
  PENDING = 'pending',
  RESOLVED = 'resolved',
  REJECTED = 'rejected',
}

export default function AdminReportIssuesPage() {
  const [issues, setIssues] = useState<IssueResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedIssue, setSelectedIssue] = useState<IssueResponse | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState<string>('')

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        setLoading(true)
        const issueService = new IssueService()
        const {data, status} = await issueService.getIssues()

        if (status === 200 && data) {
          setIssues(data)
        } else {
          setError('Failed to fetch issues')
        }
      } catch (err) {
        setError('An error occurred while fetching issues')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchIssues()
  }, [])

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

  const handleRowClick = (issue: IssueResponse) => {
    setSelectedIssue(issue)
    setSelectedStatus(issue.status)
    setIsDialogOpen(true)
  }

  const handleStatusChange = async (newStatus: string) => {
    if (!selectedIssue) return

    try {
      const issueService = new IssueService()
      const {status} = await issueService.statusUpdateIssue(selectedIssue.report_id, newStatus)

      if (status === 200) {
        setIssues(prevIssues =>
          prevIssues.map(issue =>
            issue.report_id === selectedIssue.report_id ? {...issue, status: newStatus} : issue,
          ),
        )
        setSelectedIssue(prev => prev && {...prev, status: newStatus})
      } else {
        console.error('Failed to update issue status')
      }
    } catch (err) {
      console.error('An error occurred while updating the issue status:', err)
    }
  }

  if (loading) {
    return (
      <div className='container mx-auto py-8'>
        <h1 className='text-2xl font-bold mb-6'>Reported Issues</h1>
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
        <h1 className='text-2xl font-bold mb-6'>Reported Issues</h1>
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
      <h1 className='text-2xl font-bold mb-6 text-center'>Reported Issues</h1>

      {issues.length === 0 ? (
        <div className='text-center py-12'>
          <p className='text-muted-foreground'>No reported issues found.</p>
        </div>
      ) : (
        <div className='rounded-md border mx-auto w-[800px]'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Issue Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date Reported</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {issues.map(issue => (
                <TableRow
                  key={issue.report_id}
                  onClick={() => handleRowClick(issue)}
                  className='cursor-pointer hover:bg-gray-100'>
                  <TableCell className='font-medium'>{issue.reason_title}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(issue.status)}>{issue.status}</Badge>
                  </TableCell>
                  <TableCell>{formatDate(issue.created_at)}</TableCell>
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
              <DialogTitle>{selectedIssue.reason_title}</DialogTitle>
            </DialogHeader>
            <div className='space-y-4'>
              <p>
                <strong>Description:</strong> {selectedIssue.reason_description}
              </p>
              <p>
                <strong>Status:</strong>
              </p>
              <Select value={selectedStatus} onValueChange={value => handleStatusChange(value)}>
                <SelectTrigger>
                  <SelectValue placeholder='Select a status' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={IssueStatus_Report.PENDING}>Pending</SelectItem>
                  <SelectItem value={IssueStatus_Report.RESOLVED}>Resolved</SelectItem>
                  <SelectItem value={IssueStatus_Report.REJECTED}>Rejected</SelectItem>
                </SelectContent>
              </Select>
              <p>
                <strong>Date Reported:</strong> {formatDate(selectedIssue.created_at)}
              </p>
              <div className='flex justify-end'>
                <Button onClick={() => setIsDialogOpen(false)}>Close</Button>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  )
}
