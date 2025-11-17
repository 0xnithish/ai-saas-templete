"use client";

import { createAuthClient } from "better-auth/react";
import { polarClient } from "@polar-sh/better-auth";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  plugins: [polarClient()],
});

export const {
  signIn,
  signUp,
  signOut,
  resetPassword,
  forgetPassword,
} = authClient;

// Note: For optimized session handling, use the useSessionOptimized hook
// from components/auth/SessionProvider instead of the default useSession
export const { useSession } = authClient;
