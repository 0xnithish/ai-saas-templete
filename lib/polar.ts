import { Polar } from "@polar-sh/sdk";

// Initialize Polar SDK client
export const polarClient = new Polar({
  accessToken: process.env.POLAR_ACCESS_TOKEN!,
  server: process.env.NODE_ENV === 'production' ? 'production' : 'sandbox',
});
