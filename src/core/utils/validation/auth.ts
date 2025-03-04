import * as z from 'zod'

export const loginSchema = z.object({
  email: z.string().nonempty('Email is required').email('Please enter a valid email address'),
  password: z
    .string()
    .nonempty('Password is required')
    .min(6, 'Password must be at least 6 characters'),
})

export const registerSchema = z.object({
  firstName: z
    .string()
    .nonempty('First name is required')
    .min(2, 'First name must be at least 2 characters'),
  lastName: z
    .string()
    .nonempty('Last name is required')
    .min(2, 'Last name must be at least 2 characters'),
  email: z.string().nonempty('Email is required').email('Please enter a valid email address'),
  password: z
    .string()
    .nonempty('Password is required')
    .min(6, 'Password must be at least 6 characters'),
})

export const forgotPasswordSchema = z.object({
  email: z.string().nonempty('Email is required').email('Please enter a valid email address'),
})

export const resetPasswordSchema = z.object({
  password: z
    .string()
    .nonempty('Password is required')
    .min(6, 'Password must be at least 6 characters'),
})

export type LoginData = z.infer<typeof loginSchema>
export type RegisterData = z.infer<typeof registerSchema>
export type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordData = z.infer<typeof resetPasswordSchema>
