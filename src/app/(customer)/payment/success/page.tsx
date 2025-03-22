'use client'

import { CheckCircle } from 'lucide-react'

export default function PaymentSuccessPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-center px-6">
      <CheckCircle className="w-20 h-20 text-green-500 mb-4" />
      <h1 className="text-3xl font-bold mb-2">Thanh toán thành công!</h1>
      <p className="text-lg text-gray-700 mb-4">
        Cảm ơn bạn đã đăng ký gói học. Tài khoản của bạn sẽ được nâng cấp trong thời gian sớm nhất.
      </p>
      <p className="text-sm text-gray-500">
        Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ đội ngũ hỗ trợ.
      </p>
    </div>
  )
}
