import { betterAuth } from "better-auth";
import * as React from "react";
import { Pool } from "pg";
import { Resend } from "resend";
import { dodopayments, checkout, webhooks } from "@dodopayments/better-auth";
import VerificationEmail from "@/components/emails/VerificationEmail";
import PasswordResetEmail from "@/components/emails/PasswordResetEmail";
import { dodoClient } from "./dodo";

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
    console.error("[Better Auth] Invalid DATABASE_URL format:", rawDatabaseUrl, error);
  }
}

// Initialize Postgres pool for Better Auth with optimized settings
const pool = new Pool({
  connectionString: rawDatabaseUrl!,
  max: 1, // Single connection per serverless instance to prevent exhaustion
  min: 1, // Maintain at least one connection
  idleTimeoutMillis: 60000, // Keep idle connections longer
  connectionTimeoutMillis: 15000, // Increased timeout for stability
  ssl: { rejectUnauthorized: false }, // Allow SSL connection for Supabase
});

// Handle unexpected pool errors
pool.on('error', (err) => {
  console.error('Unexpected database pool error:', err);
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
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // Cache for 5 minutes
      refreshCache: {
        updateAge: 60 // Refresh when 60 seconds remain before expiry
      },
      strategy: "compact", // Use compact strategy for smallest cookie size
    },
    freshAge: 60 * 5, // Consider session fresh for 5 minutes
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    afterEmailVerification: async (user) => {
      // Create Dodo customer after email verification
      try {
        console.log(`🔄 Creating Dodo customer for verified user: ${user.email}`);
        
        // Check if customer already exists
        const existingCustomers = await dodoClient.customers.list({
          email: user.email,
        });

        let dodoCustomerId: string;

        if (existingCustomers.items && existingCustomers.items.length > 0) {
          // Customer already exists
          dodoCustomerId = existingCustomers.items[0].customer_id;
          console.log(`✅ Found existing Dodo customer: ${dodoCustomerId}`);
        } else {
          // Create new customer in Dodo
          const newCustomer = await dodoClient.customers.create({
            email: user.email,
            name: user.name || "",
            metadata: {
              userId: user.id,
            },
          });
          
          dodoCustomerId = newCustomer.customer_id;
          console.log(`✅ Created new Dodo customer: ${dodoCustomerId}`);
        }
        
        // Update database with Dodo customer ID
        await pool.query(
          `UPDATE public.user 
           SET "dodoCustomerId" = $1, "updatedAt" = NOW()
           WHERE id = $2`,
          [dodoCustomerId, user.id]
        );
        
        console.log(`✅ Linked Dodo customer ${dodoCustomerId} to user ${user.id}`);
      } catch (error) {
        console.error('❌ Failed to create/link Dodo customer after verification:', error);
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
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      enabled: !!process.env.GOOGLE_CLIENT_ID && !!process.env.GOOGLE_CLIENT_SECRET,
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      enabled: !!process.env.GITHUB_CLIENT_ID && !!process.env.GITHUB_CLIENT_SECRET,
    },
  },
  social: {
    afterSignIn: async ({ user, account }: { user: any; account: any }) => {
      // Create Dodo customer after successful social authentication
      try {
        console.log(`🔄 Creating Dodo customer for social user: ${user.email}`);

        // Check if customer already exists
        const existingCustomers = await dodoClient.customers.list({
          email: user.email,
        });

        let dodoCustomerId: string;

        if (existingCustomers.items && existingCustomers.items.length > 0) {
          // Customer already exists
          dodoCustomerId = existingCustomers.items[0].customer_id;
          console.log(`✅ Found existing Dodo customer: ${dodoCustomerId}`);
        } else {
          // Create new customer in Dodo
          const newCustomer = await dodoClient.customers.create({
            email: user.email,
            name: user.name || "",
            metadata: {
              userId: user.id,
              provider: account.providerId,
            },
          });

          dodoCustomerId = newCustomer.customer_id;
          console.log(`✅ Created new Dodo customer: ${dodoCustomerId}`);
        }

        // Update database with Dodo customer ID
        await pool.query(
          `UPDATE public.user
           SET "dodoCustomerId" = $1, "updatedAt" = NOW()
           WHERE id = $2`,
          [dodoCustomerId, user.id]
        );

        console.log(`✅ Linked Dodo customer ${dodoCustomerId} to social user ${user.id}`);
      } catch (error) {
        console.error('❌ Failed to create/link Dodo customer for social user:', error);
      }
    },
  },
  plugins: [
    dodopayments({
      client: dodoClient,
      createCustomerOnSignUp: false, // Don't create until email verified
      use: [
        checkout({
          products: [
            {
              productId: process.env.DODO_PRODUCT_ID_FREE!,
              slug: "free",
            },
            {
              productId: process.env.DODO_PRODUCT_ID_PREMIUM!,
              slug: "premium",
            },
          ],
          successUrl:
            process.env.DODO_SUCCESS_URL ||
            `${process.env.NEXT_PUBLIC_APP_URL || process.env.BETTER_AUTH_URL || "http://localhost:3000"}/success?checkout_id={CHECKOUT_ID}`,
          authenticatedUsersOnly: true,
        }),
        webhooks({
          webhookKey: process.env.DODO_WEBHOOK_SECRET!,
          onPaymentSucceeded: async (payload) => {
            // Payment succeeded - activate user subscription
            try {
              const data = (payload as any)?.data;
              const customerId =
                data?.customer_id ??
                data?.customer?.customer_id ??
                data?.customer?.id;

              if (customerId) {
                // Update user subscription status to active
                await pool.query(
                  `UPDATE public.user 
                   SET "subscriptionStatus" = 'active',
                       "subscriptionEndsAt" = NULL,
                       "updatedAt" = NOW()
                   WHERE "dodoCustomerId" = $1`,
                  [customerId]
                );
                console.log(`✅ Activated subscription for customer ${customerId}`);
              }
            } catch (error) {
              console.error('❌ Error activating subscription:', error);
            }
          },
          onPaymentCancelled: async (payload) => {
            // Payment cancelled - update user status
            try {
              const data = (payload as any)?.data;
              const customerId =
                data?.customer_id ??
                data?.customer?.customer_id ??
                data?.customer?.id;

              if (customerId) {
                await pool.query(
                  `UPDATE public.user 
                   SET "subscriptionStatus" = 'canceled',
                       "updatedAt" = NOW()
                   WHERE "dodoCustomerId" = $1`,
                  [customerId]
                );
                console.log(`⚠️ Cancelled subscription for customer ${customerId}`);
              }
            } catch (error) {
              console.error('❌ Error canceling subscription:', error);
            }
          },
          onRefundSucceeded: async (payload) => {
            console.log('💰 Refund processed:', payload);
            // Handle refunds if needed
          },
        }),
      ],
    }),
  ],
});

export type Session = typeof auth.$Infer.Session.session;
export type User = typeof auth.$Infer.Session.user;
