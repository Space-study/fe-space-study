'use client'

import React from 'react'
import { PlanSidebar } from '@src/core/components/customer/room/tools/Plan/plan-sidebar'
import PlanNavbar from '@src/core/components/customer/room/tools/Plan/PlanNavbar'
import PlanPage from '@src/core/components/customer/room/tools/Plan/PlanBody'
 // Add this import

export default function PlanPageClient(): JSX.Element {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      {/* Modal */}
      <div className="relative w-full h-full bg-white rounded-lg shadow-lg flex overflow-hidden">
        {/* Sidebar */}
        <PlanSidebar />

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <PlanNavbar />
          <div className="flex-1 overflow-auto">
            <PlanPage />
          </div>
        </div>
      </div>
    </div>
  )
}