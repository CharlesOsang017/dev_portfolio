"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button"; // Assuming you have a Button component from @shadcn/ui
import axios from "axios";
import { useState } from "react";

// Define the Zod schema for form validation
const projectSchema = z.object({
  title: z.string().min(1, { message: "Project title is required" }),
  technologies: z
    .string()
    .min(1, { message: "At least one technology is required" })
    .refine(
      (value) => value.split(",").map((tech) => tech.trim()).filter((tech) => tech).length > 0,
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
      (file) => !file || ["image/jpeg", "image/png", "image/gif"].includes(file.type),
      { message: "Please upload a valid image file (JPEG, PNG, or GIF)" }
    ),
});

// Infer the TypeScript type from the schema
export type ProjectData = z.infer<typeof projectSchema>;

const ProjectForm = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

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
  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (file: File | undefined) => void
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      onChange(file);
    } else {
      setImagePreview(null);
      onChange(undefined);
    }
  };

  // Handle form submission
  const onSubmit = async (data: ProjectData) => {
    setError("");
    setSuccess("");
    setLoading(true);

    // Create FormData for multipart/form-data request
    const formData = new FormData();
    formData.append("title", data.title);
    const techArray = data.technologies
      .split(",")
      .map((tech) => tech.trim())
      .filter((tech) => tech);
    formData.append("technologies", JSON.stringify(techArray));
    if (data.link) formData.append("link", data.link);
    if (data.image) formData.append("image", data.image);

    try {
      // Send POST request to the API
      const response = await axios.post("/api/projects", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSuccess("Project saved successfully!");
      // Reset form
      form.reset();
      setImagePreview(null);
    } catch (err) {
      setError("Failed to save project. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Add Project</h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {success && <p className="text-green-500 text-center mb-4">{success}</p>}

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
                    <Input placeholder="https://example.com" type="url" {...field} />
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
                      onChange={(e) => handleFileChange(e, onChange)}
                      {...field}
                    />
                  </FormControl>
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="Project Preview"
                      className="mt-2 w-full h-40 object-cover rounded-md"
                    />
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className={`w-full ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {loading ? "Saving..." : "Save Project"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ProjectForm;
