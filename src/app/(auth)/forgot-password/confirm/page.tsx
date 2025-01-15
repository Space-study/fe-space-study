import {Metadata} from 'next'
import ForgotPasswordForm from './confirm'

export const metadata: Metadata = {
  title: 'Confirm Email | FocusHub',
  description: 'Get back your Password',
}

export default function RegisterPage() {
  return <ForgotPasswordForm />
}
