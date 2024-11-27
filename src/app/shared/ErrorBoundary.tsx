'use client'

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
        <div>
          <h1>Something went wrong!</h1>
          <p>{this.state.error?.message}</p>
          <button onClick={this.resetError}>Retry</button>
        </div>
      )
    }
    return this.props.children
  }
}
