import {Metadata} from 'next'
import RegisterForm from './register-form'

export const metadata: Metadata = {
  title: 'Register | FocusHub',
  description: 'Create your FocusHub account',
}

export default function RegisterPage() {
  return <RegisterForm />
}
