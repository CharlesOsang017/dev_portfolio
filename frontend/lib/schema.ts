import {z }from "zod";

export const signUpSchema = z.object({
    name: z.string().min(3, 'Name must be at least 3 characters'),
    email: z.string().email('Email address is required'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().nonempty('Confirm password is required')
}).refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match'
});

export const signInSchema = z.object({
    email: z.string().email("Email is required"),
    password: z.string().min(6, 'password is required')
})


export const experienceSchema = z.object({
    role: z.string().min(3, 'role is required'),
    company: z.string().min(3, 'company is required'),
    startDate: z.string().min(3, 'start date is required'),
    endDate: z.string().min(3, 'end date is required'),
    description: z.string().min(3, 'description is required')
})