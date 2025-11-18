import { Checkout } from '@dodopayments/nextjs';

// Static checkout (GET) - for predefined product links
export const GET = Checkout({
  bearerToken: process.env.DODO_PAYMENTS_API_KEY!,
  returnUrl: process.env.DODO_PAYMENTS_RETURN_URL || `${process.env.NEXT_PUBLIC_APP_URL}/success`,
  environment: (process.env.DODO_PAYMENTS_ENVIRONMENT as "test_mode" | "live_mode") || "test_mode",
  type: "static",
});

// Dynamic checkout (POST) - for custom product carts
export const POST = Checkout({
  bearerToken: process.env.DODO_PAYMENTS_API_KEY!,
  returnUrl: process.env.DODO_PAYMENTS_RETURN_URL || `${process.env.NEXT_PUBLIC_APP_URL}/success`,
  environment: (process.env.DODO_PAYMENTS_ENVIRONMENT as "test_mode" | "live_mode") || "test_mode",
  type: "dynamic", // or "session" for checkout sessions
});
