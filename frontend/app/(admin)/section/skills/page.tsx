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
import { Textarea } from "@/components/ui/textarea"; // Assuming you have a Textarea component from @shadcn/ui
import { Button } from "@/components/ui/button"; // Assuming you have a Button component from @shadcn/ui
import axios from "axios";
import { useState } from "react";

// Define the Zod schema for form validation
const skillSchema = z.object({
  title: z.string().min(1, { message: "Skill title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  logo: z
    .instanceof(File)
    .refine(
      (file) =>
        ["image/jpeg", "image/png", "image/svg", "image/gif"].includes(
          file.type
        ),
      { message: "Please upload a valid image file (JPEG, PNG, SVG or GIF)" }
    )
    .optional(), // Optional to allow form submission without immediate validation
});

// Infer the TypeScript type from the schema
export type SkillData = z.infer<typeof skillSchema>;

const SkillForm = () => {
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

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
  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (file: File | undefined) => void
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoPreview(URL.createObjectURL(file));
      onChange(file);
    } else {
      setLogoPreview(null);
      onChange(undefined);
    }
  };

  // Handle form submission
  const onSubmit = async (data: SkillData) => {

  };

  return (
    <div className='min-h-screen bg-gray-100 py-10 px-4'>
      <div className='max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg'>
        <h2 className='text-2xl font-bold mb-6 text-center'>Add Skill</h2>

        {error && <p className='text-red-500 text-center mb-4'>{error}</p>}
        {success && (
          <p className='text-green-500 text-center mb-4'>{success}</p>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            {/* Title */}
            <FormField
              control={form.control}
              name='title'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Skill Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Enter skill title (e.g., JavaScript)'
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
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Describe the skill'
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
              name='logo'
              render={({ field: { onChange, value, ...field } }) => (
                <FormItem>
                  <FormLabel>Skill Logo</FormLabel>
                  <FormControl>
                    <Input
                      type='file'
                      accept='image/jpeg,image/png,image/svg'
                      onChange={(e) => handleFileChange(e, onChange)}
                      {...field}
                    />
                  </FormControl>
                  {logoPreview && (
                    <div className='flex items-center justify-center'>
                      <img
                        src={logoPreview}
                        alt='Logo Preview'
                        className='mt-2 w-32 h-32 object-contain rounded-md'
                      />
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button
              type='submit'
              disabled={loading}
              className={`w-full cursor-pointer ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Saving..." : "Save Skill"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default SkillForm;
