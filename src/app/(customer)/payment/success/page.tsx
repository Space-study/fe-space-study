'use client'

import { useEffect, useRef } from 'react'
import { CheckCircle } from 'lucide-react'

export default function PaymentSuccessPage() {
  const called = useRef(false)

  useEffect(() => {
    if (called.current) return
    called.current = true

    const data = localStorage.getItem('selected_package')
    if (data) {
      const { user_id, package_id } = JSON.parse(data)

      fetch('http://localhost:8000/api/userpackage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id, package_id }),
      })
        .then(res => res.json())
        .then(data => {
          console.log('✅ Userpackage created:', data)
          localStorage.removeItem('selected_package')
        })
        .catch(err => console.error('❌ Failed to update userpackage:', err))
    }
  }, [])

  return (
    <div className='flex flex-col items-center justify-center h-screen bg-gray-100 text-center px-6'>
      <CheckCircle className='w-20 h-20 text-green-500 mb-4' />
      <h1 className='text-3xl font-bold mb-2'>Thanh toán thành công</h1>
      <p className='text-lg text-gray-700 mb-4'>
        Cảm ơn bạn đã đăng ký gói học. Tài khoản của bạn sẽ được nâng cấp trong giây lát.
      </p>
      <p className='text-sm text-gray-500'>
        Nếu có thắc mắc, vui lòng liên hệ bộ phận chăm sóc khách hàng.
      </p>
    </div>
  )
}
