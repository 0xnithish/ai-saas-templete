import DodoPayments from "dodopayments";

// Initialize Dodo Payments SDK client
export const dodoClient = new DodoPayments({
  bearerToken: process.env.DODO_PAYMENTS_API_KEY!,
  environment: (process.env.DODO_PAYMENTS_ENVIRONMENT as "test_mode" | "live_mode") || "test_mode",
});

// Legacy polarClient export for backward compatibility during migration
export const polarClient = dodoClient;
