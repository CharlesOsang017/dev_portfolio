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
const skillSchema = z.object({
  title: z.string().min(1, { message: "Skill title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  logo: z
    .instanceof(File)
    .refine(
      (file) =>
        ["image/jpeg", "image/png", "image/svg+xml", "image/gif"].includes(
          file.type
        ),
      { message: "Please upload a valid image file (JPEG, PNG, SVG, or GIF)" }
    )
    .optional(),
});

// Infer the TypeScript type from the schema
export type SkillData = z.infer<typeof skillSchema>;

const SkillForm = () => {
  const [image, setImage] = useState<string | null>(null);


  // Initialize react-hook-form
  const form = useForm<SkillData>({
    resolver: zodResolver(skillSchema),
    defaultValues: {
      title: "",
      description: "",
      logo: undefined,
    },
  });

  // Handle file input change (to update preview and set form value)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file); // Create preview URL
      setImage(imageUrl);
    }
  };

  const handleClearImage = () => {
    setImage(null);
    form.setValue("logo", undefined); // Clear the logo field in the form
  };

  // Handle form submission
  const { mutate, isPending } = useMutation({
    mutationFn: async (data: { title: string; description: string; logo?: string }) => {
      return await api.post("/skill", data);
    },
    onSuccess: () => {
      toast.success("Skill added successfully");
      form.reset();
      setImage(null); 
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || "Something went wrong";
      toast.error(errorMessage);
    },
  });

  const onSubmit = async (data: SkillData) => {
    try {
      let submissionData: { title: string; description: string; logo?: string } = {
        title: data.title,
        description: data.description,
      };

      // If a logo file is provided, convert it to base64
      if (data.logo instanceof File) {
        const base64Logo = await fileToBase64(data.logo);
        submissionData.logo = base64Logo;
      }
      mutate(submissionData);
    } catch (error) {
      console.log("Failed to process the logo image");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Add Skill</h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Skill Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter skill title (e.g., JavaScript)"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the skill"
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Logo */}
            <FormField
              control={form.control}
              name="logo"
              render={({ field: { onChange, value, ...field } }) => (
                <FormItem>
                  <FormLabel>Skill Logo</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/jpeg,image/png,image/svg+xml,image/gif"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        onChange(file); // Pass the File object to React Hook Form
                        handleFileChange(e);
                      }}
                      {...field}
                    />
                  </FormControl>
                  {image && (
                    <div className="relative">
                      <X
                        className="absolute top-2 right-2 cursor-pointer"
                        onClick={handleClearImage}
                      />
                      <div className="flex items-center justify-center">
                        <img
                          src={image}
                          alt="Logo Preview"
                          className="mt-2 w-32 h-32 object-contain rounded-md"
                        />
                      </div>
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
              className={`w-full cursor-pointer ${isPending ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {isPending ? "Saving..." : "Save Skill"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default SkillForm;