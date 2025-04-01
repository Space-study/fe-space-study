'use client'

import IssueDetail from '@/core/components/customer/room/tools/Plan/IssueDetail'
import {issueService, type IssueDetail as IssueDetailType} from '@src/core/services/plan/issues'
import {useParams} from 'next/navigation'
import {useEffect, useState} from 'react'

export default function IssuePage() {
  const params = useParams()
  const [issue, setIssue] = useState<IssueDetailType | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchIssue = async () => {
      try {
        setLoading(true)
        const data = await issueService.getIssueById(Number(params.id))
        setIssue(data)
      } catch (err) {
        setError('Failed to load issue')
        console.error('Error fetching issue:', err)
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchIssue()
    }
  }, [params.id])

  if (loading) {
    return <div className='flex items-center justify-center min-h-screen'>Loading...</div>
  }

  if (error || !issue) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        {error || 'Issue not found'}
      </div>
    )
  }
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return <IssueDetail issue={issue} />
}
