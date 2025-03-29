'use client'

import {ReactNode} from 'react'

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({children}: AuthProviderProps) {
  // const router = useRouter()
  // const pathname = usePathname()
  // const {user, updateUser} = useUser()
  // const [isLoading, setIsLoading] = useState(true) // Thêm state để theo dõi trạng thái loading

  // useEffect(() => {
  //   const fetchUser = async () => {
  //     try {
  //       const authService = new AuthService()
  //       const userData = await authService.getMe()
  //       updateUser(userData)
  //       console.log('1')
  //     } catch (err) {
  //       console.log('Login to continue', err)
  //     } finally {
  //       setIsLoading(false) // Đặt isLoading về false khi fetch hoàn thành (thành công hoặc thất bại)
  //     }
  //   }

  //   if (!user) {
  //     fetchUser()
  //   } else {
  //     setIsLoading(false) // Nếu đã có user, không cần fetch và đặt isLoading về false ngay lập tức
  //   }
  // }, [user, updateUser])

  // useEffect(() => {
  //   if (isLoading) return // Không làm gì nếu đang fetch user

  //   const publicRoute = [
  //     '/auth/login',
  //     '/auth/register',
  //     '/auth/confirm-email',
  //     '/auth/forgot-password/confirm',
  //     '/auth/forgot-password/reset',
  //     '/',
  //   ]

  //   if (!user) {
  //     console.log('2') // Đặt console.log('2') ở đây để đảm bảo nó chạy sau khi fetch hoàn thành
  //     if (!publicRoute.includes(pathname)) {
  //       router.push('/auth/login')
  //     }
  //   }
  // }, [isLoading, user, pathname, router])

  // if (isLoading) {
  //   return <div>Loading...</div> // Hiển thị loading khi đang fetch user
  // }

  return <>{children}</>
}
