'use client'

import {userService} from '@src/core/services/example/exampleService'
import {UserResponse} from '@src/core/types/user.type'
import {useEffect, useRef, useState} from 'react'
import {columns} from './columns'
import {DataTable} from './data-table'
import usePaginate from '@src/core/hooks/usePaginate'

export default function UsersPage() {

  const {
    pagination, 
  } = usePaginate<UserResponse>();
  const [isFetching, setIsFetching] = useState<boolean>(false)
  const [users, setUsers] = useState()

  const handleFetchUsers = useRef<() => Promise<void>>(async () => {
    setIsFetching(true)
    try {
      const response = await userService.getPaginatedUsers(pagination)
      const usersWithMappedFields = response.map((user: UserResponse) => ({
        id: user.id,
        fullName: user.firstName + ' ' + user.lastName,
        email: user.email,
        provider: user.provider,
        status: user.status.name,
      }))
      setUsers(usersWithMappedFields)
      setIsFetching(false)
    } catch (error) {
      console.error(error)
      setIsFetching(false)
    }
  })

  useEffect(() => {
    handleFetchUsers.current()
  }, [setUsers])

  return (
    <div>
      <DataTable columns={columns} data={users || []} isLoading={isFetching} />
    </div>
  )
}
