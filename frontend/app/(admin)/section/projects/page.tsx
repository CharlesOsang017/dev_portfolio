"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useState } from "react";
import { X } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/fetch-utils";
import { toast } from "sonner";

// Utility function to convert File to base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

// Define the Zod schema for form validation
const projectSchema = z.object({
  title: z.string().min(1, { message: "Project title is required" }),
  technologies: z
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
  link: z
    .string()
    .optional()
    .refine((value) => !value || /^https?:\/\/[^\s$.?#].[^\s]*$/.test(value), {
      message: "Please provide a valid URL for the link",
    }),
  image: z
    .instanceof(File)
    .optional()
    .refine(
      (file) =>
        !file || ["image/jpeg", "image/png", "image/gif"].includes(file.type),
      { message: "Please upload a valid image file (JPEG, PNG, or GIF)" }
    ),
});

// Infer the TypeScript type from the schema
export type ProjectData = z.infer<typeof projectSchema>;

const ProjectForm = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Initialize react-hook-form
  const form = useForm<ProjectData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: "",
      technologies: "",
      link: "",
      image: undefined,
    },
  });

  // Handle file input change (to update preview and set form value)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file); // Create preview URL
      setImagePreview(imageUrl);
    }
  };

  const handleClearImage = () => {
    setImagePreview(null);
  };

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: {title: string; technologies: string[]; link?: string; image?: string;}) => {
      return api.post("/project", data);
    },
    onSuccess: () => {
      toast.success("Project added successfully");
      form.reset();
      setImagePreview(null);
    },
    onError: (error: any) => {
      const errorMessage =
      error?.response?.data?.message || "Something went wrong";
      toast.error(errorMessage);
    },
  });

  // Handle form submission
  const onSubmit = async (data: ProjectData) => {
    try {
      let submissionData: {
        title: string;
        technologies: string[];
        link?: string;
        image?: string;
      } = {
        title: data.title,
        technologies: data.technologies
          .split(",")
          .map((tech) => tech.trim())
          .filter((tech) => tech),
        link: data.link,
      };

      // If a logo file is provided, convert it to base64
      if (data.image instanceof File) {
        const base64Logo = await fileToBase64(data.image);
        submissionData.image = base64Logo;
      }
      mutate(submissionData);
    } catch (error) {
      console.error("Error processing form submission:", error);
      toast.error("Failed to process the form submission");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Add Project</h2>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter project title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Technologies */}
            <FormField
              control={form.control}
              name="technologies"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Technologies (comma-separated)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., React, Node.js, MongoDB"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Link */}
            <FormField
              control={form.control}
              name="link"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Link (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://example.com"
                      type="url"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Image */}
            <FormField
              control={form.control}
              name="image"
              render={({ field: { onChange, value, ...field } }) => (
                <FormItem>
                  <FormLabel>Project Image (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/jpeg,image/png,image/gif"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        onChange(file); // Pass the File object to React Hook Form
                        handleFileChange(e);
                      }}
                      {...field}
                    />
                  </FormControl>
                  {imagePreview && (
                    <div className="relative">
                      <X
                        className="absolute top-2 right-2 cursor-pointer"
                        onClick={handleClearImage}
                      />
                      <img
                        src={imagePreview}
                        alt="Project Preview"
                        className="mt-2 w-full h-40 object-cover rounded-md"
                      />
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isPending}
              className={`w-full ${
                isPending ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isPending ? "Saving..." : "Save Project"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ProjectForm;