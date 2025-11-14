import { env } from "@/lib/env";
import { Webhooks } from "@polar-sh/nextjs";
import {
  getClerkIdFromEmail,
  upsertOrder,
  upsertSubscription,
  updateUserAccess,
} from "@/lib/polar/helpers";

export const POST = Webhooks({
  webhookSecret: env.POLAR_WEBHOOK_SECRET,

  onCheckoutCreated: async (payload) => {
    try {
      console.log("Checkout created:", payload.data.id);
      // Checkout created - typically no action needed yet
      // Wait for checkout.updated or order.created events
    } catch (error) {
      console.error("Error handling checkout created:", error);
    }
  },

  onCheckoutUpdated: async (payload) => {
    try {
      console.log("Checkout updated:", payload.data.id, "Status:", payload.data.status);
      
      // If checkout is confirmed/succeeded, the order will be created separately
      // This is mainly for tracking checkout status changes
    } catch (error) {
      console.error("Error handling checkout updated:", error);
    }
  },

  onOrderCreated: async (payload) => {
    try {
      console.log("Order created:", payload.data.id);
      
      const order = payload.data;
      const customerEmail = order.customer?.email;
      
      if (!customerEmail) {
        console.error("No customer email found in order:", order.id);
        return;
      }

      const clerkId = await getClerkIdFromEmail(customerEmail);

      if (!clerkId) {
        console.error("Could not find user with email:", customerEmail);
        return;
      }

      // Get product information
      const product = order.product;
      if (!product) {
        console.error("No product found in order:", order.id);
        return;
      }

      // Create order in database
      await upsertOrder({
        polar_order_id: order.id,
        clerk_id: clerkId,
        polar_checkout_id: order.checkoutId || null,
        status: "pending",
        amount: order.totalAmount || 0,
        currency: order.currency || "usd",
        product_id: product.id,
        product_name: product.name,
        customer_email: customerEmail,
        customer_name: order.customer?.name || null,
        metadata: order.metadata || null,
      });

      console.log("Order created in database for user:", clerkId);
    } catch (error) {
      console.error("Error handling order created:", error);
    }
  },

  onOrderPaid: async (payload) => {
    try {
      console.log("Order paid:", payload.data.id);
      
      const order = payload.data;
      const customerEmail = order.customer?.email;
      
      if (!customerEmail) {
        console.error("No customer email found in order:", order.id);
        return;
      }

      const clerkId = await getClerkIdFromEmail(customerEmail);

      if (!clerkId) {
        console.error("Could not find user with email:", customerEmail);
        return;
      }

      // Get product information
      const product = order.product;
      if (!product) {
        console.error("No product found in order:", order.id);
        return;
      }

      // Update order status to completed
      await upsertOrder({
        polar_order_id: order.id,
        clerk_id: clerkId,
        polar_checkout_id: order.checkoutId || null,
        status: "completed",
        amount: order.totalAmount || 0,
        currency: order.currency || "usd",
        product_id: product.id,
        product_name: product.name,
        customer_email: customerEmail,
        customer_name: order.customer?.name || null,
        metadata: order.metadata || null,
        completed_at: new Date().toISOString(),
      });

      // Grant access to the product
      await updateUserAccess({
        clerk_id: clerkId,
        polar_customer_id: order.customerId,
        product_id: product.id,
        has_access: true,
        polar_order_id: order.id,
      });

      console.log("Order completed and access granted for user:", clerkId);
    } catch (error) {
      console.error("Error handling order paid:", error);
    }
  },

  onSubscriptionCreated: async (payload) => {
    try {
      console.log("Subscription created:", payload.data.id);
      
      const subscription = payload.data;
      const customerEmail = subscription.customer?.email;
      
      if (!customerEmail) {
        console.error("No customer email found in subscription:", subscription.id);
        return;
      }

      const clerkId = await getClerkIdFromEmail(customerEmail);

      if (!clerkId) {
        console.error("Could not find user with email:", customerEmail);
        return;
      }

      // Create subscription in database
      await upsertSubscription({
        polar_subscription_id: subscription.id,
        clerk_id: clerkId,
        polar_product_id: subscription.productId,
        polar_price_id: (subscription as any).productPriceId || (subscription as any).priceId || "",
        status: subscription.status,
        current_period_start: subscription.currentPeriodStart ? new Date(subscription.currentPeriodStart).toISOString() : null,
        current_period_end: subscription.currentPeriodEnd ? new Date(subscription.currentPeriodEnd).toISOString() : null,
        cancel_at_period_end: subscription.cancelAtPeriodEnd || false,
        customer_email: customerEmail,
        customer_name: subscription.customer?.name || null,
        metadata: subscription.metadata || null,
      });

      console.log("Subscription created in database for user:", clerkId);
    } catch (error) {
      console.error("Error handling subscription created:", error);
    }
  },

  onSubscriptionActive: async (payload) => {
    try {
      console.log("Subscription active:", payload.data.id);
      
      const subscription = payload.data;
      const customerEmail = subscription.customer?.email;
      
      if (!customerEmail) {
        console.error("No customer email found in subscription:", subscription.id);
        return;
      }

      const clerkId = await getClerkIdFromEmail(customerEmail);

      if (!clerkId) {
        console.error("Could not find user with email:", customerEmail);
        return;
      }

      // Update subscription status
      await upsertSubscription({
        polar_subscription_id: subscription.id,
        clerk_id: clerkId,
        polar_product_id: subscription.productId,
        polar_price_id: (subscription as any).productPriceId || (subscription as any).priceId || "",
        status: "active",
        current_period_start: subscription.currentPeriodStart ? new Date(subscription.currentPeriodStart).toISOString() : null,
        current_period_end: subscription.currentPeriodEnd ? new Date(subscription.currentPeriodEnd).toISOString() : null,
        cancel_at_period_end: subscription.cancelAtPeriodEnd || false,
        customer_email: customerEmail,
        customer_name: subscription.customer?.name || null,
        metadata: subscription.metadata || null,
      });

      // Grant access to the product
      await updateUserAccess({
        clerk_id: clerkId,
        polar_customer_id: subscription.customerId,
        product_id: subscription.productId,
        has_access: true,
        polar_subscription_id: subscription.id,
      });

      console.log("Subscription activated and access granted for user:", clerkId);
    } catch (error) {
      console.error("Error handling subscription active:", error);
    }
  },

  onSubscriptionCanceled: async (payload) => {
    try {
      console.log("Subscription canceled:", payload.data.id);
      
      const subscription = payload.data;
      const customerEmail = subscription.customer?.email;
      
      if (!customerEmail) {
        console.error("No customer email found in subscription:", subscription.id);
        return;
      }

      const clerkId = await getClerkIdFromEmail(customerEmail);

      if (!clerkId) {
        console.error("Could not find user with email:", customerEmail);
        return;
      }

      // Update subscription status
      await upsertSubscription({
        polar_subscription_id: subscription.id,
        clerk_id: clerkId,
        polar_product_id: subscription.productId,
        polar_price_id: (subscription as any).productPriceId || (subscription as any).priceId || "",
        status: "canceled",
        current_period_start: subscription.currentPeriodStart ? new Date(subscription.currentPeriodStart).toISOString() : null,
        current_period_end: subscription.currentPeriodEnd ? new Date(subscription.currentPeriodEnd).toISOString() : null,
        cancel_at_period_end: subscription.cancelAtPeriodEnd || false,
        customer_email: customerEmail,
        customer_name: subscription.customer?.name || null,
        metadata: subscription.metadata || null,
        canceled_at: new Date().toISOString(),
      });

      // Revoke access to the product
      await updateUserAccess({
        clerk_id: clerkId,
        polar_customer_id: subscription.customerId,
        product_id: subscription.productId,
        has_access: false,
        polar_subscription_id: subscription.id,
      });

      console.log("Subscription canceled and access revoked for user:", clerkId);
    } catch (error) {
      console.error("Error handling subscription canceled:", error);
    }
  },

  onSubscriptionRevoked: async (payload) => {
    try {
      console.log("Subscription revoked:", payload.data.id);
      
      const subscription = payload.data;
      const customerEmail = subscription.customer?.email;
      
      if (!customerEmail) {
        console.error("No customer email found in subscription:", subscription.id);
        return;
      }

      const clerkId = await getClerkIdFromEmail(customerEmail);

      if (!clerkId) {
        console.error("Could not find user with email:", customerEmail);
        return;
      }

      // Update subscription status
      await upsertSubscription({
        polar_subscription_id: subscription.id,
        clerk_id: clerkId,
        polar_product_id: subscription.productId,
        polar_price_id: (subscription as any).productPriceId || (subscription as any).priceId || "",
        status: "revoked",
        current_period_start: subscription.currentPeriodStart ? new Date(subscription.currentPeriodStart).toISOString() : null,
        current_period_end: subscription.currentPeriodEnd ? new Date(subscription.currentPeriodEnd).toISOString() : null,
        cancel_at_period_end: subscription.cancelAtPeriodEnd || false,
        customer_email: customerEmail,
        customer_name: subscription.customer?.name || null,
        metadata: subscription.metadata || null,
        canceled_at: new Date().toISOString(),
      });

      // Revoke access to the product
      await updateUserAccess({
        clerk_id: clerkId,
        polar_customer_id: subscription.customerId,
        product_id: subscription.productId,
        has_access: false,
        polar_subscription_id: subscription.id,
      });

      console.log("Subscription revoked and access removed for user:", clerkId);
    } catch (error) {
      console.error("Error handling subscription revoked:", error);
    }
  },

  onCustomerCreated: async (payload) => {
    try {
      console.log("Customer created:", payload.data.id);
      // Customer created in Polar - typically no action needed
      // User profile should already exist in Supabase via Clerk
    } catch (error) {
      console.error("Error handling customer created:", error);
    }
  },

  onCustomerUpdated: async (payload) => {
    try {
      console.log("Customer updated:", payload.data.id);
      // Customer updated in Polar - typically no action needed
      // User profile updates should come from Clerk webhooks
    } catch (error) {
      console.error("Error handling customer updated:", error);
    }
  },
})
