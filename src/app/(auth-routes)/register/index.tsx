/* eslint-disable unicorn/prevent-abbreviations */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { DialogContent, DialogTitle } from "@radix-ui/react-dialog";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { CreateUser, Otp } from "~/actions/register";
import { DialogDemo } from "~/components/common/Dialog";
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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "~/components/ui/input-otp";
import { useToast } from "~/components/ui/use-toast";
import { RegisterSchema } from "~/schemas";
import { GoogleSignIn } from "../socialbuttons";

const SignUp = () => {
  const [isLoading, startTransition] = useTransition();
  const router = useRouter();
  const [token, setToken] = useState("");

  const [otp, setOtp] = useState("");
  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      password: "",
      first_name: "",
      last_name: "",
    },
  });
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const onSubmit = async (values: z.infer<typeof RegisterSchema>) => {
    startTransition(async () => {
      await CreateUser(values).then(async (data) => {
        if (data.status === 201) {
          setOpen(true);
          setToken(data.access_token);
        }

        toast({
          title:
            data.status === 201
              ? "Check your email for otp"
              : "an error occurred",
          description: data.status === 201 ? "Verify email" : data.error,
        });
      });
    });
  };

  const onSubmitOtp = async (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault?.();
    startTransition(async () => {
      const value = { otp };
      await Otp(value, token).then(async (data) => {
        if (data.status === 200) {
          setOpen(false);
          router.push("/login");
        }

        toast({
          title: data.status === 200 ? "Email verified" : "an error occurred",
          description:
            data.status === 200 ? "verified sucessfull" : data.message,
        });
      });
    });
  };

  return (
    <div>
      <div className="flex flex-col items-center gap-2">
        <h1 className="text-2xl font-bold">Sign Up</h1>
        <p className="my-4 text-gray-500">
          Create an account to get started with us.
        </p>
      </div>
      <div className="flex flex-col justify-center space-y-4 sm:flex-row sm:space-x-6 sm:space-y-0">
        <GoogleSignIn />
      </div>
      <div className="mx-auto py-4 md:w-2/4">
        <Form {...form}>
          <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="first_name"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <FormLabel>First name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your first name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="last_name"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <FormLabel>last name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your Last name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2">
                  <div className="flex flex-col gap-2">
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your email address"
                        {...field}
                        type="email"
                      />
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2">
                  <div className="flex flex-col gap-2">
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your password"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              Create Account
            </Button>
            <DialogDemo open={open} onOpenChanged={setOpen}>
              <DialogContent
                aria-labelledby="dialog-title"
                aria-describedby="dialog-description"
                className="flex w-full flex-col items-center gap-4"
              >
                <DialogTitle className="text-xl font-bold text-[#0F172A]">
                  Sign Up
                </DialogTitle>
                <div className="flex flex-col items-center">
                  <p className="text-xs text-gray-600">
                    Choose your sign-up method:
                  </p>
                  <ul className="flex list-disc flex-col items-center text-xs text-gray-600">
                    <li>Use the temporary sign-in code sent to your mail or</li>
                    <li>Continue with email and password</li>
                  </ul>
                </div>
                <p className="text-xs">
                  Please paste (or type) your 6-digit code:{" "}
                </p>
                <InputOTP
                  maxLength={6}
                  onComplete={onSubmitOtp}
                  value={otp}
                  onChange={setOtp}
                  disabled={isLoading}
                >
                  {...[0, 1, 2, 3, 4, 5].map((number_) => (
                    <InputOTPGroup key={number_}>
                      <InputOTPSlot index={number_} />
                    </InputOTPGroup>
                  ))}
                </InputOTP>
                <Button type="submit" className="w-full">
                  Continue
                </Button>
                <div className="flex flex-col items-center">
                  <p className="text-xs text-gray-500">
                    Would you rather use email and password?
                  </p>
                  <p className="text-xs text-orange-500">
                    Continue with email and password
                  </p>
                </div>
                <p className="text-center text-xs text-gray-500">
                  We would process your data as set forth in our Terms of Use,
                  Privacy Policy and Data Processing Agreement
                </p>
              </DialogContent>
            </DialogDemo>
            <div className="flex justify-center gap-2">
              <p className="text-sm">Already Have An Account?</p>
              <Link className="text-sm text-orange-500" href="/login">
                Login
              </Link>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};
export default SignUp;
