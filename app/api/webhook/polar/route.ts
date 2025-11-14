import { env } from "@/lib/env";
import { Webhooks } from "@polar-sh/nextjs";

export const POST = Webhooks({
  webhookSecret: env.POLAR_WEBHOOK_SECRET,
  onCheckoutCreated: async (payload) => {
    console.log("Checkout created:", payload);
    // Handle checkout creation
  },
  onCheckoutUpdated: async (payload) => {
    console.log("Checkout updated:", payload);
    // Handle checkout updates (e.g., status changes)
    // Update your database here
  },
  onOrderCreated: async (payload) => {
    console.log("Order created:", payload);
    // Handle order creation
  },
  onOrderPaid: async (payload) => {
    console.log("Order paid:", payload);
    // Handle successful payment
  },
  onSubscriptionCreated: async (payload) => {
    console.log("Subscription created:", payload);
    // Handle subscription creation
  },
  onSubscriptionActive: async (payload) => {
    console.log("Subscription active:", payload);
    // Handle subscription activation
  },
  onSubscriptionCanceled: async (payload) => {
    console.log("Subscription canceled:", payload);
    // Handle subscription cancellation
  },
  onSubscriptionRevoked: async (payload) => {
    console.log("Subscription revoked:", payload);
    // Handle subscription revocation
  },
  onCustomerCreated: async (payload) => {
    console.log("Customer created:", payload);
    // Handle customer creation
  },
  onCustomerUpdated: async (payload) => {
    console.log("Customer updated:", payload);
    // Handle customer updates
  },
})
