import { TEAM_PANTHERS_BASEURL } from ".";

import Calls from "./axios";

const $http = Calls(`${TEAM_PANTHERS_BASEURL}`);

export const GOOGLE_SIGN_IN = async (profile: any) => {
  try {
    const { data } = await $http.post("/auth/google", profile);
    return data;
  } catch (error: any) {
    return {
      error: error.message || "An unexpected error occurred.",
      success: false,
    };
  }
};
