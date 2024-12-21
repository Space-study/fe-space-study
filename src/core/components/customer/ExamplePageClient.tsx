'use client'

import {useAppDispatch, useAppSelector} from '@/core/hooks/useRedux'
import {clearUser, setAuthentication, setUser} from '@/core/redux/slices/userSlice'
import React, {useEffect, useState} from 'react'

interface ExamplePageClientProps {
  user: {name: {firstname: string; lastname: string}; email: string}
}

const ExamplePageClient: React.FC<ExamplePageClientProps> = ({user}) => {
  const dispatch = useAppDispatch()

  // Get user from the Redux store, including the new `isAuthenticated` state
  const userFromStore = useAppSelector(state => state.user)

  // Local state to track if we are in the client-side
  const [isClient, setIsClient] = useState(false)

  // Set isClient to true once component is mounted on the client-side
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Dispatch action to set user if needed (only on the client)
  useEffect(() => {
    if (isClient && !userFromStore.name && !userFromStore.email && user) {
      // Map name.firstname and name.lastname to username
      const username = `${user.name.firstname} ${user.name.lastname}`
      dispatch(setUser({name: username, email: user.email}))
    }
  }, [dispatch, user, userFromStore, isClient])

  // Avoid rendering the component on the server-side
  if (!isClient) return null

  // Safely access user data (assuming the structure is correct)
  const {name, email} = userFromStore

  return (
    <div className='p-6 space-y-4'>
      <h1 className='text-2xl font-bold mb-4'>User Details</h1>
      <div>
        <p>Username: {name}</p> {/* Display the username */}
        <p>Email: {email}</p>
        <p>Authenticated: {userFromStore.isAuthenticated ? 'Yes' : 'No'}</p>{' '}
        {/* Display authentication status */}
        <button
          className='mt-4 mr-2 bg-red-500 text-white py-2 px-4 rounded'
          onClick={() => dispatch(clearUser())}>
          Clear User
        </button>
        <button
          className='mt-4 mr-2 bg-red-500 text-white py-2 px-4 rounded'
          onClick={() => dispatch(setAuthentication(true))}>
          Set Authenticated
        </button>{' '}
        {/* Set user as authenticated */}
        <button
          className='mt-4 mr-2 bg-red-500 text-white py-2 px-4 rounded'
          onClick={() => dispatch(setAuthentication(false))}>
          Set Unauthenticated
        </button>{' '}
        {/* Set user as unauthenticated */}
      </div>
    </div>
  )
}

export default ExamplePageClient
