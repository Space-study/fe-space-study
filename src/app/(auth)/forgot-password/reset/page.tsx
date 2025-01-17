import {Metadata} from 'next'
import ResetPassword from './reset'

export const metadata: Metadata = {
  title: 'Reset Password | FocusHub',
  description: 'Get back your Password',
}

export default function RegisterPage() {
  return <ResetPassword />
}
