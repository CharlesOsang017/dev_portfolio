import { z } from "zod";

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
    description: z
    .string()
    .min(1, { message: "At least one technology is required" })
    .refine(
      (value) =>
        value
          .split(",")
          .map((tech) => tech.trim())
          .filter((tech) => tech).length > 0,
      { message: "Please provide at least one valid technology" }
    ),
})

// export const experienceSchema = z.object({
//     company: z.string().min(1, { message: "Company name is required" }),
//     role: z.string().min(1, { message: "Role is required" }),
//     startDate: z.string().min(1, { message: "Start date is required" }),
//     endDate: z.string().min(1, { message: "End date is required" }),
//     description: z
//       .string()
//       .min(1, { message: "At least one description is required" })
//       .refine(
//         (value) =>
//           value
//             .split(",")
//             .map((desc) => desc.trim())
//             .filter((desc) => desc).length > 0,
//         { message: "Please provide at least one valid description" }
//       ),
//   });