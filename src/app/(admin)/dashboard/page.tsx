'use client'

import BarChartMultiple from '@src/core/components/admin/barChartMulti'
import StaticsCard from '@src/core/components/admin/card'
import PieChartDonut from '@src/core/components/admin/pieChart'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from '@src/core/components/ui/breadcrumb'
import html2canvas from 'html2canvas'
import {jsPDF} from 'jspdf'
import {ArrowDownToLine} from 'lucide-react'
import {useRef} from 'react'

import {Button} from '@src/core/components/ui/button'
import {Separator} from '@src/core/components/ui/separator'
import {SidebarInset, SidebarTrigger} from '@src/core/components/ui/sidebar'

export default function Dashboard() {
  const dashboardRef = useRef(null)

  const handleExportPDF = async () => {
    if (!dashboardRef.current) return
    const canvas = await html2canvas(dashboardRef.current, {
      scale: 2,
      useCORS: true,
    })
    const imgData = canvas.toDataURL('image/png')

    const pdf = new jsPDF('landscape')
    const imgWidth = pdf.internal.pageSize.getWidth()
    const imgHeight = (canvas.height * imgWidth) / canvas.width

    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight)
    pdf.save('dashboard.pdf')
  }

  return (
    <SidebarInset>
      <header className='flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12'>
        <div className='flex items-center gap-2 px-4'>
          <SidebarTrigger className='-ml-1' />
          <Separator orientation='vertical' className='mr-2 h-4' />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className='hidden md:block'>
                <BreadcrumbLink href='dashboard'>DashBoard</BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div ref={dashboardRef} className='flex flex-1 flex-col overflow-y-auto gap-4 p-4 pt-0'>
        <Button onClick={handleExportPDF} className='ml-auto' variant='outline'>
          <ArrowDownToLine />
          Export as PDF
        </Button>
        <div className='rounded-xl'>
          <StaticsCard />
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <BarChartMultiple />
          <PieChartDonut />
        </div>
      </div>
    </SidebarInset>
  )
}
