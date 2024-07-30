"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, ShieldCheck } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next-nprogress-bar";
import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { loginUser } from "~/actions/login";
import LoadingSpinner from "~/components/miscellaneous/loading-spinner";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { useToast } from "~/components/ui/use-toast";
import { LoginSchema } from "~/schemas";
import { GoogleSignIn } from "../socialbuttons";

const getInputClassName = (hasError: boolean, isValid: boolean) => {
  const baseClasses =
    "font-inter w-full rounded-md border px-3 py-6 text-sm font-normal leading-[21.78px] transition duration-150 ease-in-out focus:outline-none";

  if (hasError) {
    return `${baseClasses} border-red-500 focus:border-red-500 focus:ring-red-500 text-red-900`;
  } else if (isValid) {
    return `${baseClasses} border-orange-500 focus:border-orange-500  text-neutralColor-dark-2`;
  }
  return `${baseClasses} border-gray-300 focus:border-orange-500  text-neutralColor-dark-2`;
};

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  // const searchP = useSearchParams();
  // const callback_url = searchP.get("callbackUrl");
  const [isLoading, startTransition] = useTransition();
  // const { updateUser } = useUser();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof LoginSchema>) => {
    startTransition(async () => {
      await loginUser(values).then(async (data) => {
        const { email, password } = values;
        if (data.status === 200) {
          await signIn("credentials", {
            email,
            password,
            redirect: false,
          });
        }
        router.push("/dashboard");
        toast({
          title: data.status === 200 ? "login success" : "an error occurred",
          description: data.status === 200 ? "routing now" : data.error,
        });
      });
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  useEffect(() => {
    document.title = "Login";
  }, []);
  return (
    <div className="flex min-h-full items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="font-inter text-neutralColor-dark-2 mb-5 text-center text-2xl font-semibold leading-tight">
            Login
          </h1>
          <p className="font-inter text-neutralColor-dark-2 mt-2 text-center text-sm font-normal leading-6">
            Welcome back, you&apos;ve been missed!
          </p>
        </div>

        <div className="flex flex-col justify-center space-y-4 sm:flex-row sm:space-x-6 sm:space-y-0">
          <GoogleSignIn />
        </div>

        <div className="flex items-center justify-center">
          <hr className="w-full border-t border-gray-300" />
          <span className="font-inter text-neutralColor-dark-1 px-3 text-xs font-normal leading-tight">
            OR
          </span>
          <hr className="w-full border-t border-gray-300" />
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-neutralColor-dark-2">
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="Enter Email Address"
                      {...field}
                      className={getInputClassName(
                        !!form.formState.errors.email,
                        form.formState.isSubmitted &&
                          !form.formState.errors.email,
                      )}
                    />
                  </FormControl>
                  <FormMessage data-testid="email-error" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-neutralColor-dark-2">
                    Password
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        disabled={isLoading}
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter Password"
                        {...field}
                        className={getInputClassName(
                          !!form.formState.errors.password,
                          form.formState.isSubmitted &&
                            !form.formState.errors.password,
                        )}
                      />
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute inset-y-0 right-0 flex items-center pr-3"
                      >
                        {showPassword ? (
                          <Eye
                            className="h-5 w-5 text-gray-400"
                            data-testid="eye-icon"
                          />
                        ) : (
                          <EyeOff
                            className="h-5 w-5 text-gray-400"
                            data-testid="eye-off-icon"
                          />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage data-testid="password-error" />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              variant="default"
              size="default"
              className="h-12 w-full rounded-md bg-primary px-4 py-6 text-white hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
            >
              {isLoading ? (
                <span className="flex items-center gap-x-2">
                  <span className="animate-pulse">Logging in...</span>{" "}
                  <LoadingSpinner className="size-4 animate-spin sm:size-5" />
                </span>
              ) : (
                <span>Login</span>
              )}
            </Button>
          </form>
        </Form>

        <Button
          type="button"
          variant="outline"
          size="default"
          className="text-neutralColor-dark-2 hover:bg-gray50 w-full rounded-md border border-stroke-colors-stroke bg-white px-4 py-6 text-sm font-medium focus:outline-none"
        >
          <Link href="/login/magic-link">Sign in with magic link</Link>
        </Button>

        <p className="font-inter text-neutralColor-dark-1 mt-5 text-center text-sm font-normal leading-[15.6px]">
          Don&apos;t Have An Account?{" "}
          <Link
            href="/register"
            className="font-inter ms-1 text-left text-base font-bold leading-[19.2px] text-primary hover:text-orange-400"
            data-testid="link"
          >
            Sign Up
          </Link>
        </p>

        <p className="mt-2 text-center text-xs text-gray-500">
          <ShieldCheck className="mr-1 hidden h-4 w-4 text-gray-400 sm:inline-block" />
          By logging in, you agree to the{" "}
          <a
            href="#"
            className="text-sm font-bold text-primary hover:text-orange-500"
          >
            Terms of Service
          </a>{" "}
          and{" "}
          <a
            href="#"
            className="text-sm font-bold text-primary hover:text-orange-500"
          >
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
