import {Metadata} from 'next'
import LoginForm from './login-form'

export const metadata: Metadata = {
  title: 'Login | FocusHub',
  description: 'Log in to your FocusHub account',
}

export default function LoginPage() {
  return <LoginForm />
}
