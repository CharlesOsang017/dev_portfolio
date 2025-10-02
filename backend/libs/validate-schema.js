import {z} from 'zod'


export const registerAdminSchema = z.object({
    name: z.string().min(3, {message: 'Name must be at least 3 characters long'}),
    email: z.string().email({message: 'Invalid email address'}),
    password: z.string().min(6, {message: 'Password must be at least 6 characters long'})
})

export const loginAdminSchema = z.object({
    email: z.string().email({message: "Invalid email address"}),
    password: z.string().min(6, {message: "Password must be at least 6 characters long"})
})

export const skillsSchema = z.object({
    title: z.string().min(3, {message: 'Name must be at least 3 characters long'}),
    percentage: z.number().min(0).max(100, {message: 'Percentage must be between 0 and 100'}),
    category: z.string().optional()
})

export const experienceSchema = z.object({
    title: z.string().min(3, {message: 'Name must be at least 3 characters long'}),
    company: z.string().min(3, {message: 'Name must be at least 3 characters long'}),
    startDate: z.string(),
    endDate: z.string(),
    description: z.string().min(3, {message: 'Name must be at least 3 characters long'})    
})

export const projectSchema = z.object({
    title: z.string().min(3, {message: 'Name must be at least 3 characters long'}),
    description: z.string().min(3, {message: 'Name must be at least 3 characters long'}),
    link: z.string().optional(),
    image: z.string().optional()
})