"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"; // Assuming you have a Textarea component from @shadcn/ui
import { Button } from "@/components/ui/button"; // Assuming you have a Button component from @shadcn/ui
import axios from "axios";
import { useState } from "react";

// Define the Zod schema for form validation
const aboutSchema = z.object({
  heroImage: z
    .instanceof(File)
    .refine(
      (file) => ["image/jpeg", "image/png", "image/gif"].includes(file.type),
      { message: "Please upload a valid image file (JPEG, PNG, or GIF) for Hero Image" }
    ),
  workImage: z
    .instanceof(File)
    .refine(
      (file) => ["image/jpeg", "image/png", "image/gif"].includes(file.type),
      { message: "Please upload a valid image file (JPEG, PNG, or GIF) for Work Image" }
    ),
  heroTitle: z.string().min(1, { message: "Hero title is required" }),
  heroDescription: z.string().min(1, { message: "Hero description is required" }),
  aboutDescription: z.string().min(1, { message: "About description is required" }),
  projectsCompleted: z
    .string()
    .min(1, { message: "Projects completed is required" })
    .refine((value) => !isNaN(Number(value)) && Number(value) >= 0, {
      message: "Projects completed must be a valid number",
    }),
  yearsOfExperience: z
    .string()
    .min(1, { message: "Years of experience is required" })
    .refine((value) => !isNaN(Number(value)) && Number(value) >= 0, {
      message: "Years of experience must be a valid number",
    }),
});

// Infer the TypeScript type from the schema
export type AboutData = z.infer<typeof aboutSchema>;

const AboutForm = () => {
  const [previews, setPreviews] = useState<{
    heroImage: string | null;
    workImage: string | null;
  }>({ heroImage: null, workImage: null });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Initialize react-hook-form
  const form = useForm<AboutData>({
    resolver: zodResolver(aboutSchema),
    defaultValues: {
      heroImage: undefined,
      workImage: undefined,
      heroTitle: "",
      heroDescription: "",
      aboutDescription: "",
      projectsCompleted: "",
      yearsOfExperience: "",
    },
  });

  // Handle file input change (to update preview and set form value)
  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (file: File | undefined) => void,
    fieldName: "heroImage" | "workImage"
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreviews((prev) => ({
        ...prev,
        [fieldName]: URL.createObjectURL(file),
      }));
      onChange(file);
    } else {
      setPreviews((prev) => ({
        ...prev,
        [fieldName]: null,
      }));
      onChange(undefined);
    }
  };

  // Handle form submission
  const onSubmit = async (data: AboutData) => {
    setError("");
    setSuccess("");
    setLoading(true);

    // Create FormData for multipart/form-data request
    const formData = new FormData();
    formData.append("heroImage", data.heroImage);
    formData.append("workImage", data.workImage);
    formData.append("heroTitle", data.heroTitle);
    formData.append("heroDescription", data.heroDescription);
    formData.append("aboutDescription", data.aboutDescription);
    formData.append("projectsCompleted", data.projectsCompleted);
    formData.append("yearsOfExperience", data.yearsOfExperience);

    try {
      // Send POST request to the API
      const response = await axios.post("/api/about", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSuccess("About data saved successfully!");
      // Reset form
      form.reset();
      setPreviews({ heroImage: null, workImage: null });
    } catch (err) {
      setError("Failed to save data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Create About Page Content</h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {success && <p className="text-green-500 text-center mb-4">{success}</p>}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Hero Image */}
            <FormField
              control={form.control}
              name="heroImage"
              render={({ field: { onChange, value, ...field } }) => (
                <FormItem>
                  <FormLabel>Hero Image</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/jpeg,image/png,image/gif"
                      onChange={(e) => handleFileChange(e, onChange, "heroImage")}
                      {...field}
                    />
                  </FormControl>
                  {previews.heroImage && (
                    <img
                      src={previews.heroImage}
                      alt="Hero Preview"
                      className="mt-2 w-full h-40 object-cover rounded-md"
                    />
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Work Image */}
            <FormField
              control={form.control}
              name="workImage"
              render={({ field: { onChange, value, ...field } }) => (
                <FormItem>
                  <FormLabel>Work Image</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/jpeg,image/png,image/gif"
                      onChange={(e) => handleFileChange(e, onChange, "workImage")}
                      {...field}
                    />
                  </FormControl>
                  {previews.workImage && (
                    <img
                      src={previews.workImage}
                      alt="Work Preview"
                      className="mt-2 w-full h-40 object-cover rounded-md"
                    />
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Hero Title */}
            <FormField
              control={form.control}
              name="heroTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hero Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter hero title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Hero Description */}
            <FormField
              control={form.control}
              name="heroDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hero Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter hero description"
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            /* About Description */
            <FormField
              control={form.control}
              name="aboutDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>About Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter about description"
                      rows={6}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Projects Completed */}
            <FormField
              control={form.control}
              name="projectsCompleted"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Projects Completed</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter number of projects"
                      min="0"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Years of Experience */}
            <FormField
              control={form.control}
              name="yearsOfExperience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Years of Experience</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter years of experience"
                      min="0"
                      {...field}
                    />
                  </FormControl>
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
              {loading ? "Saving..." : "Save About Content"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default AboutForm;
