import {z} from 'zod'
export const UserResponse = z.object({
  id: z.number(),
  email: z.string().email(),
  fullName: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  provider: z.string(),
  status: z.object({
    name: z.string(),
  }),
})
export type UserResponse = z.infer<typeof UserResponse>