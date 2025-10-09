'use client'
import { signInSchema } from "@/lib/schema";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
// import { Link, useNavigate } from "react-router";
// import { useLoginMutation } from "@/hooks/use-auth";
import { toast } from "sonner";
// import { useAuth } from "@/provider/auth-context";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
// import { useLoginMutation } from "@/app/hooks/use-auth";
// import { useAuth } from "@/app/provider/auth.context";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/fetch-utils";

export type SignInFormData = z.infer<typeof signInSchema>;
const SignIn = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  // const navigate = useNavigate();
  const router = useRouter()

  const form = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // const { mutate, isPending } = useLoginMutation();
  // const { login } = useAuth();

  const {mutate, isPending} = useMutation({
    mutationFn: (data: SignInFormData)=>{
      return api.post("/user/login", data);
    },
    onSuccess: () => {   
      toast.success("Login successful");
      router.push("/section");
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message;
      toast.error(errorMessage || "Something went wrong");
    },
  });
  const handleOnSubmit = (values: SignInFormData) => {
    mutate(values);
  };
  return (
    <div className='min-h-screen flex flex-col items-center justify-center bg-muted/40 p-4'>
      <Card className='max-w-md w-full shadow-xl'>
        <CardHeader>
          <CardTitle className='text-2xl font-bold text-center'>
            Welcome back
          </CardTitle>
          <CardDescription className='text-sm text-muted-foreground text-center'>
            Sign in to your account to continue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleOnSubmit)}
              className='space-y-6'
            >
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input
                        type='email'
                        placeholder='email@example.com'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <div className='flex items-center justify-between'>
                      <FormLabel>Password</FormLabel>
                      <Link
                        href='/forgot-password'
                        className='text-sm text-blue-600'
                      >
                        Forgot Password?
                      </Link>
                    </div>
                    <FormControl>
                      <div className='relative flex items-center justify-between'>
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder='email@example.com'
                          {...field}
                        />
                        {showPassword ? (
                          <Eye
                            onClick={() => setShowPassword(!showPassword)}
                            size={20}
                            className='absolute right-2 cursor-pointer'
                          />
                        ) : (
                          <EyeOff
                            size={20}
                            className='absolute right-2 cursor-pointer'
                            onClick={() => setShowPassword(!showPassword)}
                          />
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                disabled={isPending}
                type='submit'
                className='w-full cursor-pointer'
              >
                {isPending ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </Form>
          <CardFooter className='flex justify-center mt-2'>
            <div className='flex items-center justify-center'>
              <p className='text-sm text-muted-foreground'>
                Don&apos;t have an account?{" "}
                <Link className='text-blue-600' href='/auth/register'>
                  Sign Up
                </Link>
              </p>
            </div>
          </CardFooter>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignIn;