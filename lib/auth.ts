import { betterAuth } from "better-auth";
import * as React from "react";
import { Pool } from "pg";
import { Resend } from "resend";
import { polar, checkout, portal, usage, webhooks } from "@polar-sh/better-auth";
import VerificationEmail from "@/components/emails/VerificationEmail";
import PasswordResetEmail from "@/components/emails/PasswordResetEmail";
import { polarClient } from "./polar";

// Initialize Resend for email sending (only if API key is available)
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const rawDatabaseUrl = process.env.DATABASE_URL;
if (!rawDatabaseUrl) {
  console.error("[Better Auth] DATABASE_URL is not set in environment variables");
} else {
  try {
    const parsed = new URL(rawDatabaseUrl);
    console.log(
      "[Better Auth] Using DATABASE_URL host:",
      parsed.hostname,
      "port:",
      parsed.port || "(default 5432)"
    );
  } catch (error) {
    console.error("[Better Auth] Invalid DATABASE_URL format:", rawDatabaseUrl);
  }
}

// Initialize Postgres pool for Better Auth
const pool = new Pool({
  connectionString: rawDatabaseUrl!,
  max: 1, // Limit connections in serverless environments
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
  ssl: { rejectUnauthorized: false }, // Allow SSL connection for Supabase
});

export const auth = betterAuth({
  database: pool,
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    minPasswordLength: 8,
    autoSignIn: false,
    sendResetPassword: async ({ user, url }: { user: { email: string; name?: string }; url: string }) => {
      if (!resend) {
        console.warn('Resend not configured - skipping password reset email');
        return;
      }
      await resend.emails.send({
        from: process.env.EMAIL_FROM || "noreply@yourdomain.com",
        to: user.email,
        subject: "Reset your password",
        react: React.createElement(PasswordResetEmail, {
          resetUrl: url,
          userEmail: user.email,
          userName: user.name ?? undefined,
        }),
      });
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    afterEmailVerification: async (user) => {
      // Create Polar customer after email verification
      try {
        console.log(`🔄 Creating Polar customer for verified user: ${user.email}`);
        
        // Check if customer already exists
        const existingCustomers = await polarClient.customers.list({
          email: user.email,
          limit: 1,
        });

        let polarCustomerId: string;

        if (existingCustomers.result && existingCustomers.result.items.length > 0) {
          // Customer already exists (shouldn't happen with createCustomerOnSignUp: false)
          polarCustomerId = existingCustomers.result.items[0].id;
          console.log(`✅ Found existing Polar customer: ${polarCustomerId}`);
        } else {
          // Create new customer in Polar
          const newCustomer = await polarClient.customers.create({
            email: user.email,
            name: user.name || undefined,
            metadata: {
              userId: user.id,
            },
          });
          
          polarCustomerId = newCustomer.id;
          console.log(`✅ Created new Polar customer: ${polarCustomerId}`);
        }
        
        // Update database with Polar customer ID
        await pool.query(
          `UPDATE public.user 
           SET "polarCustomerId" = $1, "updatedAt" = NOW()
           WHERE id = $2`,
          [polarCustomerId, user.id]
        );
        
        console.log(`✅ Linked Polar customer ${polarCustomerId} to user ${user.id}`);
      } catch (error) {
        console.error('❌ Failed to create/link Polar customer after verification:', error);
      }
    },
    sendVerificationEmail: async ({ user, url }: { user: { email: string; name?: string }; url: string }) => {
      if (!resend) {
        console.warn('Resend not configured - skipping email verification');
        return;
      }
      await resend.emails.send({
        from: process.env.EMAIL_FROM || "noreply@yourdomain.com",
        to: user.email,
        subject: "Verify your email address",
        react: React.createElement(VerificationEmail, {
          verificationUrl: url,
          userEmail: user.email,
          userName: user.name ?? undefined,
        }),
      });
    },
  },
  trustedOrigins: [
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    "http://localhost:3000",
    ...(process.env.NGROK_URL ? [process.env.NGROK_URL] : []),
  ],
  secret: process.env.BETTER_AUTH_SECRET!,
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  plugins: [
    polar({
      client: polarClient,
      createCustomerOnSignUp: false, // Don't create until email verified
      use: [
        checkout({
          products: [
            {
              productId: process.env.POLAR_PRODUCT_ID_FREE!,
              slug: "free",
            },
            {
              productId: process.env.POLAR_PRODUCT_ID_PREMIUM!,
              slug: "premium",
            },
          ],
          successUrl: process.env.POLAR_SUCCESS_URL || "/success?checkout_id={CHECKOUT_ID}",
          authenticatedUsersOnly: true,
        }),
        portal(),
        usage(),
        webhooks({
          secret: process.env.POLAR_WEBHOOK_SECRET!,
          onSubscriptionActive: async (payload) => {
            try {
              // The payload contains customer data with externalId
              const userId = payload.data.customer?.externalId;
              
              if (!userId) {
                console.warn('[Polar Webhook] No externalId found for customer');
                return;
              }

              // Update user subscription status to active
              await pool.query(
                `UPDATE public.user 
                 SET "subscriptionStatus" = 'active',
                     "subscriptionEndsAt" = NULL,
                     "polarCustomerId" = $2
                 WHERE id = $1`,
                [userId, payload.data.customerId]
              );

              console.log('[Polar Webhook] Granted active subscription to user:', userId);
            } catch (error) {
              console.error('[Polar Webhook] Error activating subscription:', error);
            }
          },
          onSubscriptionCanceled: async (payload) => {
            try {
              const userId = payload.data.customer?.externalId;
              const endsAt = payload.data.endsAt ? new Date(payload.data.endsAt) : null;
              
              if (!userId) {
                console.warn('[Polar Webhook] No externalId found for customer');
                return;
              }

              await pool.query(
                `UPDATE public.user 
                 SET "subscriptionStatus" = 'canceled',
                     "subscriptionEndsAt" = $2
                 WHERE id = $1`,
                [userId, endsAt]
              );

              console.log('[Polar Webhook] Marked subscription as canceled for user:', userId);
            } catch (error) {
              console.error('[Polar Webhook] Error canceling subscription:', error);
            }
          },
          onSubscriptionRevoked: async (payload) => {
            try {
              const userId = payload.data.customer?.externalId;
              
              if (!userId) {
                console.warn('[Polar Webhook] No externalId found for customer');
                return;
              }

              await pool.query(
                `UPDATE public.user 
                 SET "subscriptionStatus" = 'free',
                     "subscriptionEndsAt" = NULL
                 WHERE id = $1`,
                [userId]
              );

              console.log('[Polar Webhook] Revoked subscription access for user:', userId);
            } catch (error) {
              console.error('[Polar Webhook] Error revoking subscription:', error);
            }
          },
        }),
      ],
    }),
  ],
});

export type Session = typeof auth.$Infer.Session.session;
export type User = typeof auth.$Infer.Session.user;
