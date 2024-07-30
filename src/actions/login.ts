/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable unicorn/prevent-abbreviations */
"use server";

import * as z from "zod";

import { LoginSchema } from "~/schemas";
import Calls from "./axios";

const $http = Calls(process.env.API_URL);

export const loginUser = async (values: z.infer<typeof LoginSchema>) => {
  const validatedFields = LoginSchema.safeParse(values);
  if (!validatedFields.success) {
    return {
      error: "Login Failed. Please check your email and password.",
    };
  }
  try {
    const res = await $http.post("/auth/login", validatedFields.data);
    return {
      status: res.status,
      user: res.data.user,
      access_token: res.data.access_token,
    };
  } catch (error: any) {
    return {
      message: error?.response?.data.message,
      status: error?.response?.status,
    };
  }
};

export const nextlogin = async (values: z.infer<typeof LoginSchema>) => {
  const validatedFields = LoginSchema.safeParse(values);
  if (!validatedFields.success) {
    return {
      error: "Login Failed. Please check your email and password.",
    };
  }

  try {
    const res = await $http.post("/auth/login", validatedFields.data);

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
