import {Button} from '@src/core/components/ui/button'
import {Input} from '@src/core/components/ui/input' // Thêm input để nhập số trang
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@src/core/components/ui/select'
import {Table} from '@tanstack/react-table'
import {ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight} from 'lucide-react'
import {useState} from 'react'

interface DataTablePaginationProps<TData> {
  table: Table<TData>
}

export function DataTablePagination<TData>({table}: DataTablePaginationProps<TData>) {
  const [pageInput, setPageInput] = useState<string>(`${table.getState().pagination.pageIndex + 1}`)

  const handlePageChange = () => {
    const pageNumber = Number(pageInput) - 1
    if (!isNaN(pageNumber) && pageNumber >= 0 && pageNumber < table.getPageCount()) {
      table.setPageIndex(pageNumber)
    } else {
      setPageInput(`${table.getState().pagination.pageIndex + 1}`)
    }
  }

  return (
    <div className='flex items-center justify-between px-2 py-2'>
      <div className='flex-1 text-sm text-muted-foreground'>
        {table.getFilteredSelectedRowModel().rows.length} of{' '}
        {table.getFilteredRowModel().rows.length} row(s) selected.
      </div>
      <div className='flex items-center space-x-6 lg:space-x-8'>
        <div className='flex items-center space-x-2'>
          <p className='text-sm font-medium'>Rows per page</p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={value => table.setPageSize(Number(value))}>
            <SelectTrigger className='h-8 w-[70px] bg-white'>
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side='top'>
              {[10, 30, 50].map(pageSize => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className='flex items-center space-x-2 '>
          <Button
            variant='outline'
            className='hidden h-8 w-8 p-0 lg:flex bg-white'
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}>
            <ChevronsLeft />
          </Button>
          <Button
            variant='outline'
            className='h-8 w-8 p-0 bg-white'
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}>
            <ChevronLeft />
          </Button>

          <Input
            className='h-8 w-12 text-center text-sm bg-white'
            value={pageInput}
            onChange={e => setPageInput(e.target.value)}
            onBlur={handlePageChange}
            onKeyDown={e => e.key === 'Enter' && handlePageChange()}
          />
          <span className='text-sm font-medium'>/ {table.getPageCount()}</span>

          <Button
            variant='outline'
            className='h-8 w-8 p-0'
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}>
            <ChevronRight />
          </Button>
          <Button
            variant='outline'
            className='hidden h-8 w-8 p-0 lg:flex bg-white'
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}>
            <ChevronsRight />
          </Button>
        </div>
      </div>
    </div>
  )
}
