'use client'

import {Button} from '@src/core/components/ui/button'
import React from 'react'

export default class ErrorBoundary extends React.Component<
  {children: React.ReactNode},
  {hasError: boolean; error: Error | null}
> {
  constructor(props: {children: React.ReactNode}) {
    super(props)
    this.state = {hasError: false, error: null}
  }

  static getDerivedStateFromError(error: Error) {
    return {hasError: true, error}
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error Boundary Caught:', error, errorInfo)
  }

  resetError = () => {
    this.setState({hasError: false, error: null})
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className='bg-white min-h-screen flex items-center justify-center p-4'>
          <div className='text-center space-y-4'>
            <h1 className='text-2xl font-bold text-red-600'>Something went wrong!</h1>
            <p className='text-gray-600'>
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <Button onClick={this.resetError} variant='destructive' className='w-6/12'>
              Retry
            </Button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
