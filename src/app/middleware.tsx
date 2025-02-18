import type {NextRequest} from 'next/server'
import {NextResponse} from 'next/server'

export function middleware(request: NextRequest) {
  const jwt = request.cookies.get('accessToken') // Lấy JWT từ cookie
  const publicPages = ['/auth/login', '/auth/register', '/blog'] // Các trang cho phép truy cập mà không cần JWT

  // Kiểm tra xem trang hiện tại có nằm trong danh sách publicPages không
  const isPublicPage = publicPages.some(page => request.nextUrl.pathname.startsWith(page))

  // Nếu không có JWT và không phải trang public, chuyển hướng về trang login
  if (!jwt && !isPublicPage) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  return NextResponse.next() // Cho phép truy cập
}

export const config = {
  matcher: ['/:path*'], // Áp dụng middleware cho tất cả các route
}
