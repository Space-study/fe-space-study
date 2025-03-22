'use client'

import {Button} from '@/core/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/core/components/ui/card'
import {Input} from '@/core/components/ui/input'
import {Label} from '@/core/components/ui/label'
import {Textarea} from '@/core/components/ui/textarea'
import {IssueService} from '@/core/services/issues/issue-service' // Adjust the import path as needed
import {useUser} from '@src/app/shared/UserProvider'
import type React from 'react'
import {useState} from 'react'

interface IssueFormData {
  reporter_id: number
  reason_title: string
  reason_description: string
  status: string
}

export default function IssueReportForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const issueService = new IssueService()
  const {user} = useUser()

  // This would typically come from authentication context or props
  const reporterId = user?.id || 0

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)

    const issueData: IssueFormData = {
      reporter_id: reporterId,
      reason_title: formData.get('reason_title') as string,
      reason_description: formData.get('reason_description') as string,
      status: 'pending',
    }

    try {
      const response = await issueService.createIssue(issueData)

      if (response.status === 200 && response.data) {
        alert('Issue reported successfully')
        // Type-cast e.currentTarget to HTMLFormElement and reset the form safely
        const form = e.currentTarget as HTMLFormElement
        if (form) {
          form.reset()
        }
      } else {
        throw new Error('Issue creation failed')
      }
    } catch (error) {
      alert('Error reporting issue')
      console.error('Error submitting issue:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className='w-full max-w-md mx-auto my-16'>
      <CardHeader>
        <CardTitle>Report an Issue</CardTitle>
        <CardDescription>
          Please provide details about the issue youre experiencing.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className='space-y-4'>
          <input type='hidden' name='reporter_id' value={reporterId} />
          <input type='hidden' name='status' value='pending' />

          <div className='space-y-2'>
            <Label htmlFor='reason_title'>Issue Title</Label>
            <Input
              id='reason_title'
              name='reason_title'
              placeholder='Enter a brief title for the issue'
              required
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='reason_description'>Description</Label>
            <Textarea
              id='reason_description'
              name='reason_description'
              placeholder='Please provide a detailed description of the issue'
              rows={5}
              required
            />
          </div>
        </CardContent>

        <CardFooter className='flex justify-end'>
          <Button type='submit' disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Report'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
