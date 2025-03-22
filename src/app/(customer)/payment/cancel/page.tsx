'use client'

import { XCircle } from 'lucide-react'

export default function PaymentCancelPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-center px-6">
      <XCircle className="w-20 h-20 text-red-500 mb-4" />
      <h1 className="text-3xl font-bold mb-2">Giao dịch đã bị huỷ</h1>
      <p className="text-lg text-gray-700 mb-4">
        Bạn đã huỷ quá trình thanh toán. Nếu đây là nhầm lẫn, hãy thử lại.
      </p>
      <p className="text-sm text-gray-500">
        Nếu cần hỗ trợ, vui lòng liên hệ bộ phận chăm sóc khách hàng.
      </p>
    </div>
  )
}
