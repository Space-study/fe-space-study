import ManageBlog from '@src/core/components/admin/blogs/ManageBlog'
import { SidebarInset, SidebarTrigger } from '@src/core/components/ui/sidebar'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@src/core/components/ui/breadcrumb'
import { Separator } from '@src/core/components/ui/separator'
export default function BlogsPage() {
    return (
        <SidebarInset>
             
              <header className='flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12'>
                <div className='flex items-center gap-2 px-4'>
                  <SidebarTrigger className='-ml-1' />
                  <Separator orientation='vertical' className='mr-2 h-4' />
                  <Breadcrumb>
                    <BreadcrumbList>
                      <BreadcrumbItem className='hidden md:block'>
                        <BreadcrumbLink href='#'>Content Management</BreadcrumbLink>
                      </BreadcrumbItem>
                      <BreadcrumbSeparator className='hidden md:block' />
                      <BreadcrumbItem>
                        <BreadcrumbPage>Blog</BreadcrumbPage>
                      </BreadcrumbItem>
                    </BreadcrumbList>
                  </Breadcrumb>
                </div>
              </header>
    
              <ManageBlog />
    
            </SidebarInset>
     
     )       
  
}
