import { z } from "zod";

export const registerAdminSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters long" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
});

export const loginAdminSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
});

export const skillsSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Name must be at least 3 characters long" }),
  description: z
    .string()
    .min(0)
    .max(100, { message: "Percentage must be between 0 and 100" }),
  logo: z
    .string()
    .min(3, { message: "Name must be at least 3 characters long" }),
});

export const experienceSchema = z.object({
  company: z
    .string()
    .min(3, { message: "Name must be at least 3 characters long" }),
  role: z
    .string()
    .min(3, { message: "Name must be at least 3 characters long" }),
  startDate: z.string(),
  endDate: z.string(),
  description: z
    .array(
      z.string().min(3, {
        message: "Each technology must be at least 3 characters long",
      })
    )
    .min(1, { message: "At least one technology is required" }) // Ensure array isn't empty
    .nonempty({ message: "Technologies array cannot be empty" }),
});

export const projectSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Name must be at least 3 characters long" }),
  technologies: z
    .array(
      z.string().min(3, {
        message: "Each technology must be at least 3 characters long",
      })
    )
    .min(1, { message: "At least one technology is required" }) // Ensure array isn't empty
    .nonempty({ message: "Technologies array cannot be empty" }), // Alternative to min(1)
  link: z.string().optional(),
  image: z.string().optional(),
});

export const aboutSchema = z.object({
  heroTitle: z
    .string()
    .min(3, { message: "Name must be at least 3 characters long" }),
  heroDescription: z
    .string()
    .min(3, { message: "Name must be at least 3 characters long" }),
  aboutDescription: z
    .string()
    .min(3, { message: "Name must be at least 3 characters long" }),
  projectsCompleted: z.number().min(1, {
    message: "projects completed must be at least 1 characters long",
  }),
  yearsOfExperience: z.number().min(1, {
    message: "years of experience must be at least 1 characters long",
  }),
  heroImage: z.string(),
  workImage: z.string(),
});
