'use client'

import {columns} from '@src/core/components/admin/tableUserPart/columns'
import {UserType, userService} from '@src/core/services/user/user-service'
import {useEffect, useState} from 'react'
import {TableUi} from './tableUi'

export default function DataTable() {
  const [users, setUsers] = useState<UserType[]>([])

  useEffect(() => {
    const controller = new AbortController()

    const fetchUsers = async () => {
      try {
        const data = await userService.getAllUsers()
        setUsers(data)
      } catch (err) {
        console.error(err)
      }
    }

    fetchUsers()

    return () => controller.abort()
  }, [])
  return (
    <div>
      <TableUi data={users} columns={columns} />
    </div>
  )
}
