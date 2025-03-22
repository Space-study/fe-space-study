'use client'
import {type Background, backgroundService} from '@/core/services/room/background-service'
import {notFound} from 'next/navigation'
import React, {useEffect, useState} from 'react'
import {BackgroundForm} from '../background-form'

interface BackgroundEditPageProps {
  params: Promise<{id: string}>
}

export default function BackgroundEditPage({params}: BackgroundEditPageProps) {
  const [paramId, setParamId] = useState<string | null>(null)
  const [background, setBackground] = useState<Background>()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    params.then(({id}) => {
      setParamId(id)
    })
  }, [params])

  useEffect(() => {
    if (!paramId) return

    if (paramId === 'new') {
      setLoading(false)
      return
    }

    const id = Number.parseInt(paramId)
    if (isNaN(id)) {
      setError(true)
      setLoading(false)
      return
    }

    backgroundService
      .getBackgroundById(id)
      .then(data => {
        setBackground(data)
        setLoading(false)
      })
      .catch(() => {
        setError(true)
        setLoading(false)
      })
  }, [paramId])

  if (loading) {
    return <div className='container py-6'>Loading...</div>
  }

  if (error) {
    return notFound()
  }

  return (
    <div className='container py-6'>
      <h1 className='text-3xl font-bold tracking-tight mb-6'>
        {paramId === 'new' ? 'Add New Background' : 'Edit Background'}
      </h1>
      <BackgroundForm background={background} />
    </div>
  )
}
