import { Webhooks } from "@polar-sh/nextjs";

export const POST = Webhooks({
  webhookSecret: process.env.POLAR_WEBHOOK_SECRET || '',
  onPayload: async (payload) => {
    console.log("Received Polar webhook payload:", payload);
    
    try {
      // Handle different event types
      switch (payload.type) {
        case "checkout.updated":
          console.log("Checkout updated:", payload.data);
          break;
        case "order.created":
          console.log("Order created:", payload.data);
          break;
        case "subscription.created":
          console.log("Subscription created:", payload.data);
          break;
        default:
          console.log("Unhandled webhook event type:", payload.type);
      }
    } catch (error) {
      console.error("Error processing webhook:", error);
      throw error;
    }
  },
});
