'use client'

import {UserType} from '@/core/components/admin/tableUserPart/columns'
import {columns} from '@src/core/components/admin/tableUserPart/columns'
import {RequestBuilder} from '@src/core/utils/axios/request-builder'
import {useEffect, useState} from 'react'
import {TableUi} from './tableUi'

export default function DataTable() {
  const [users, setUsers] = useState<UserType[]>([])

  useEffect(() => {
    const controller = new AbortController()

    async function onUser() {
      try {
        const token = localStorage.getItem('authToken')
        console.log(token)
        if (!token) return
        const url = new RequestBuilder()
          .setPrefix('api')
          .setVersion('v1')
          .setResourcePath('users')
          .buildUrl()

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) throw new Error('Failed ')

        const result = await response.json()
        console.log(result.payload)
        setUsers(result.payload)
      } catch (error) {
        console.error('Error fetching profile:', error)
      }
    }
    onUser()
    return () => controller.abort() // Cleanup request on unmount
  }, [])
  return (
    <div>
      <TableUi data={users} columns={columns} />
    </div>
  )
}
