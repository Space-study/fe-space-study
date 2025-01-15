import BarChartMultiple from '@src/core/components/admin/BarChartMultiple'
import PieChartDonut from '@src/core/components/admin/PieChartDonut'
import StaticsCard from '@src/core/components/admin/card'
import DataTable from '@src/core/components/admin/table'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@src/core/components/ui/breadcrumb'
import {Separator} from '@src/core/components/ui/separator'
import {SidebarInset, SidebarTrigger} from '@src/core/components/ui/sidebar'

export default function dashboard() {
  return (
    <SidebarInset>
      <header className='flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12'>
        <div className='flex items-center gap-2 px-4'>
          <SidebarTrigger className='-ml-1' />
          <Separator orientation='vertical' className='mr-2 h-4' />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className='hidden md:block'>
                <BreadcrumbLink href='#'>DashBoard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className='hidden md:block' />
              <BreadcrumbItem>
                <BreadcrumbPage>Statics</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className='flex flex-1 flex-col  overflow-y-auto gap-4 p-4 pt-0'>
        <div className='grid auto-rows-min gap-4 md:grid-cols-4'>
          <div className='aspect-video rounded-xl bg-muted/50'>
            <StaticsCard />
          </div>
          <div className='aspect-video rounded-xl bg-muted/50'>
            <StaticsCard />
          </div>
          <div className='aspect-video rounded-xl bg-muted/50'>
            <StaticsCard />
          </div>
          <div className='aspect-video rounded-xl bg-muted/50'>
            <StaticsCard />
          </div>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <BarChartMultiple />
          <PieChartDonut />
        </div>
        <div className='min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min'>
          <DataTable />
        </div>
      </div>
    </SidebarInset>
  )
}
