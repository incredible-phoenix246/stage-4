/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable unicorn/prevent-abbreviations */
"use server";

import * as z from "zod";

import { OtpSchema, RegisterSchema } from "~/schemas";
import Calls from "./axios";

const $http = Calls(process.env.API_URL);

export const CreateUser = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values);
  if (!validatedFields.success) {
    return {
      error: "registration  Failed. Please check your email and password.",
    };
  }
  try {
    const res = await $http.post("/auth/register", validatedFields.data);
    return {
      user: res.data.newUser,
      access_token: res.data.access_token,
    };
  } catch (error: any) {
    return {
      message: error?.response?.data.message,
      status: error?.response?.status,
    };
  }
};

export const Otp = async (values: z.infer<typeof OtpSchema>, token: string) => {
  const otp = values;

  const userdata = { otp: Number(otp), token };

  try {
    const res = await $http.post("/auth/verify-otp", userdata);

    return {
      status: res.status,
      message: res.data.message,
      user: res.data.user,
    };
  } catch (error: any) {
    return {
      message: error?.response?.data.message,
      status: error?.response?.status,
    };
  }
};
