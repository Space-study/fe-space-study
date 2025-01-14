import {Metadata} from 'next'
import RegisterForm from './register-form'

export const metadata: Metadata = {
  title: 'Register | FocusHub',
  description: 'Create your FocusHub',
}

export default function RegisterPage() {
  return <RegisterForm />
}
