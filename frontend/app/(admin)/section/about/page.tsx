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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/fetch-utils";
import { toast } from "sonner";
import { X } from "lucide-react";

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
const aboutSchema = z.object({
  heroImage: z
    .instanceof(File)
    .refine(
      (file) => ["image/jpeg", "image/png", "image/gif"].includes(file.type),
      {
        message:
          "Please upload a valid image file (JPEG, PNG, or GIF) for Hero Image",
      }
    ),
  workImage: z
    .instanceof(File)
    .refine(
      (file) => ["image/jpeg", "image/png", "image/gif"].includes(file.type),
      {
        message:
          "Please upload a valid image file (JPEG, PNG, or GIF) for Work Image",
      }
    ),
  heroTitle: z.string().min(1, { message: "Hero title is required" }),
  heroDescription: z
    .string()
    .min(1, { message: "Hero description is required" }),
  aboutDescription: z
    .string()
    .min(1, { message: "About description is required" }),
  projectsCompleted: z
    .number({ message: "Projects completed must be a number" })
    .min(0, { message: "Projects completed must be a non-negative number" }),
  yearsOfExperience: z
    .number({ message: "Years of experience must be a number" })
    .min(0, { message: "Years of experience must be a non-negative number" }),
});

// Infer the TypeScript type from the schema
export type AboutData = z.infer<typeof aboutSchema>;

const AboutForm = () => {
  const [previews, setPreviews] = useState<{
    heroImage: string | null;
    workImage: string | null;
  }>({ heroImage: null, workImage: null });

  // Initialize react-hook-form
  const form = useForm<AboutData>({
    resolver: zodResolver(aboutSchema),
    defaultValues: {
      heroImage: undefined,
      workImage: undefined,
      heroTitle: "",
      heroDescription: "",
      aboutDescription: "",
      projectsCompleted: 0,
      yearsOfExperience: 0,
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

  // Handle clearing a specific image preview
  const handleClearImage = (fieldName: "heroImage" | "workImage") => {
    setPreviews((prev) => ({
      ...prev,
      [fieldName]: null,
    }));
    form.setValue(fieldName, undefined!);
  };

  // Define mutation for API call
  const { mutate, isPending } = useMutation({
    mutationFn: async (data: {
      heroImage: string;
      workImage: string;
      heroTitle: string;
      heroDescription: string;
      aboutDescription: string;
      projectsCompleted: number;
      yearsOfExperience: number;
    }) => {
      return api.post("/about", data);
    },
    onSuccess: () => {
      toast.success("About content saved successfully!");
      form.reset();
      setPreviews({ heroImage: null, workImage: null });
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message || "Failed to save about content";
      toast.error(errorMessage);
    },
  });

  // Handle form submission
  const onSubmit = async (data: AboutData) => {
    try {
      // Convert images to base64
      const heroImageBase64 = await fileToBase64(data.heroImage);
      const workImageBase64 = await fileToBase64(data.workImage);

      const submissionData = {
        heroImage: heroImageBase64,
        workImage: workImageBase64,
        heroTitle: data.heroTitle,
        heroDescription: data.heroDescription,
        aboutDescription: data.aboutDescription,
        projectsCompleted: data.projectsCompleted,
        yearsOfExperience: data.yearsOfExperience,
      };

      mutate(submissionData);
    } catch (error) {
      console.error("Error processing form submission:", error);
      toast.error("Failed to process the form submission");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Create About Page Content
        </h2>

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
                      onChange={(e) =>
                        handleFileChange(e, onChange, "heroImage")
                      }
                      {...field}
                    />
                  </FormControl>
                  {previews.heroImage && (
                    <div className="relative">
                      <X
                        className="absolute top-2 right-2 cursor-pointer"
                        onClick={() => handleClearImage("heroImage")}
                        aria-label="Clear Hero Image"
                      />
                      <img
                        src={previews.heroImage}
                        alt="Hero Preview"
                        className="mt-2 w-full h-40 object-cover rounded-md"
                      />
                    </div>
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
                      onChange={(e) =>
                        handleFileChange(e, onChange, "workImage")
                      }
                      {...field}
                    />
                  </FormControl>
                  {previews.workImage && (
                    <div className="relative">
                      <X
                        className="absolute top-2 right-2 cursor-pointer"
                        onClick={() => handleClearImage("workImage")}
                        aria-label="Clear Work Image"
                      />
                      <img
                        src={previews.workImage}
                        alt="Work Preview"
                        className="mt-2 w-full h-40 object-cover rounded-md"
                      />
                    </div>
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

            {/* About Description */}
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
                      value={field.value ?? ""}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value ? Number(e.target.value) : undefined
                        )
                      }
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
                      value={field.value ?? ""}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value ? Number(e.target.value) : undefined
                        )
                      }
                    />
                  </FormControl>
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
              {isPending ? "Saving..." : "Save About Content"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default AboutForm;