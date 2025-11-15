## ADDED Requirements

### Requirement: Polar SDK Integration
The system SHALL integrate the Polar SDK with Better Auth to enable payment processing and subscription management.

#### Scenario: Polar client initialization
- **WHEN** the application starts
- **THEN** a Polar SDK client MUST be initialized with the access token from environment variables
- **AND** the client MUST be configured for the appropriate environment (sandbox or production)

#### Scenario: Better Auth plugin configuration
- **WHEN** Better Auth is configured
- **THEN** the Polar plugin MUST be added with checkout, portal, usage, and webhooks sub-plugins
- **AND** automatic customer creation on signup MUST be enabled

### Requirement: Product Configuration
The system SHALL configure Polar products for Free and Premium subscription tiers.

#### Scenario: Product mapping
- **WHEN** the checkout plugin is configured
- **THEN** Free and Premium products MUST be mapped with their Polar product IDs
- **AND** each product MUST have a friendly slug for easy reference (e.g., "free", "premium")

#### Scenario: Environment-specific product IDs
- **WHEN** products are configured
- **THEN** product IDs MUST be loaded from environment variables
- **AND** different product IDs MUST be supported for sandbox and production environments

### Requirement: Automatic Customer Creation
The system SHALL automatically create Polar customer records when users sign up.

#### Scenario: New user signup
- **WHEN** a user completes email verification and account creation
- **THEN** a Polar customer record MUST be created automatically
- **AND** the Polar customer ID MUST be associated with the user account

#### Scenario: Customer data sync
- **WHEN** a Polar customer is created
- **THEN** the user's email address MUST be used as the customer email
- **AND** the customer record MUST be linked to the user's Better Auth session

### Requirement: Checkout Flow
The system SHALL provide an authenticated checkout flow for purchasing subscriptions.

#### Scenario: Initiating checkout
- **WHEN** an authenticated user clicks an upgrade or subscribe button
- **THEN** the system MUST call `authClient.checkout()` with the product slug or ID
- **AND** the user MUST be redirected to Polar's hosted checkout page

#### Scenario: Pre-filled checkout information
- **WHEN** a user is redirected to checkout
- **THEN** their email address MUST be pre-filled and locked
- **AND** the checkout MUST be associated with their authenticated session

#### Scenario: Successful checkout redirect
- **WHEN** a user completes payment successfully
- **THEN** they MUST be redirected to the success URL with a checkout ID parameter
- **AND** the success page MUST display a confirmation message

#### Scenario: Authenticated-only checkout
- **WHEN** checkout is configured
- **THEN** `authenticatedUsersOnly` MUST be set to true
- **AND** unauthenticated users MUST NOT be able to initiate checkout sessions

### Requirement: Webhook Event Handling
The system SHALL process Polar webhook events to sync subscription state and handle payment lifecycle events.

#### Scenario: Webhook endpoint configuration
- **WHEN** the application is deployed
- **THEN** a webhook endpoint MUST be available at `/api/polar/webhooks`
- **AND** the endpoint MUST verify webhook signatures using the webhook secret

#### Scenario: Checkout updated event
- **WHEN** a `checkout.updated` webhook is received
- **THEN** the system MUST log the checkout status change
- **AND** the system MUST track when checkouts transition from confirmed to succeeded

#### Scenario: Order paid event
- **WHEN** an `order.paid` webhook is received
- **THEN** the system MUST log the successful payment
- **AND** the system MUST record the order details for audit purposes

#### Scenario: Subscription activated event
- **WHEN** a `subscription.active` webhook is received
- **THEN** the user's subscription status MUST be updated to "premium"
- **AND** the user MUST be granted access to premium features immediately

#### Scenario: Subscription canceled event
- **WHEN** a `subscription.canceled` webhook is received
- **THEN** the user's subscription status MUST be marked as "canceled"
- **AND** the subscription end date MUST be stored for end-of-period access

#### Scenario: Subscription revoked event
- **WHEN** a `subscription.revoked` webhook is received
- **THEN** the user's subscription status MUST be updated to "free"
- **AND** premium access MUST be revoked immediately

#### Scenario: Customer state changed event
- **WHEN** a `customer.state_changed` webhook is received
- **THEN** the system MUST sync the customer's subscription state
- **AND** any changes to subscription status MUST be reflected in the user's account

#### Scenario: Webhook error handling
- **WHEN** a webhook event fails to process
- **THEN** the error MUST be logged with full event details
- **AND** the webhook MUST return an appropriate HTTP status code for retry logic

### Requirement: Customer Portal Access
The system SHALL provide authenticated users with access to the Polar customer portal for subscription management.

#### Scenario: Portal access from dashboard
- **WHEN** an authenticated user clicks "Manage Subscription" in their profile or dashboard
- **THEN** the system MUST redirect them to the Polar customer portal
- **AND** the portal MUST be pre-authenticated with their customer session

#### Scenario: Portal capabilities
- **WHEN** a user accesses the customer portal
- **THEN** they MUST be able to view their active subscriptions
- **AND** they MUST be able to view their order history
- **AND** they MUST be able to manage their subscription (cancel, update payment method)
- **AND** they MUST be able to view granted benefits

### Requirement: Subscription Status Display
The system SHALL display the user's current subscription status and plan information in the UI.

#### Scenario: Dashboard subscription indicator
- **WHEN** a user views their dashboard
- **THEN** their current subscription plan (Free or Premium) MUST be displayed
- **AND** the subscription status (active, canceled, trial) MUST be shown if applicable

#### Scenario: Profile subscription details
- **WHEN** a user views their profile page
- **THEN** their subscription details MUST be visible
- **AND** a link to manage their subscription MUST be provided for premium users

#### Scenario: Free user upgrade prompts
- **WHEN** a free user views premium features or the dashboard
- **THEN** upgrade prompts MUST be displayed encouraging them to subscribe
- **AND** the prompts MUST link to the pricing page or directly initiate checkout

### Requirement: Feature Gating
The system SHALL restrict access to premium features based on subscription status.

#### Scenario: Premium feature access check
- **WHEN** a user attempts to access a premium feature
- **THEN** the system MUST verify their subscription status
- **AND** access MUST be granted only if the user has an active premium subscription

#### Scenario: Free user feature restriction
- **WHEN** a free user attempts to access a premium feature
- **THEN** the system MUST display an upgrade prompt
- **AND** the user MUST be redirected to the pricing page or checkout flow

#### Scenario: Canceled subscription grace period
- **WHEN** a user has a canceled subscription that hasn't expired yet
- **THEN** they MUST retain premium access until the subscription end date
- **AND** the UI MUST indicate their subscription will end on the specified date

### Requirement: Environment Configuration
The system SHALL support separate Polar configurations for sandbox and production environments.

#### Scenario: Sandbox environment setup
- **WHEN** the application runs in development or staging
- **THEN** the Polar SDK MUST be configured with the sandbox server
- **AND** sandbox access tokens and product IDs MUST be used

#### Scenario: Production environment setup
- **WHEN** the application runs in production
- **THEN** the Polar SDK MUST be configured with the production server
- **AND** production access tokens and product IDs MUST be used

#### Scenario: Environment variable validation
- **WHEN** the application starts
- **THEN** required Polar environment variables MUST be validated
- **AND** the application MUST fail to start if critical variables are missing

### Requirement: Pricing Page
The system SHALL provide a pricing page displaying available subscription tiers and their features.

#### Scenario: Pricing page display
- **WHEN** a user navigates to the pricing page
- **THEN** Free and Premium tiers MUST be displayed with clear feature comparisons
- **AND** pricing information MUST be shown for each tier
- **AND** call-to-action buttons MUST be provided for each tier

#### Scenario: Authenticated user pricing actions
- **WHEN** an authenticated user views the pricing page
- **THEN** the "Subscribe" button MUST initiate the checkout flow
- **AND** their current plan MUST be highlighted or indicated

#### Scenario: Unauthenticated user pricing actions
- **WHEN** an unauthenticated user views the pricing page
- **THEN** the "Subscribe" button MUST redirect them to sign up or log in
- **AND** after authentication, they MUST be redirected back to initiate checkout

### Requirement: Database Schema for Subscription Data
The system SHALL store subscription-related data in the database for efficient querying and access control.

#### Scenario: User subscription fields
- **WHEN** the database schema is migrated
- **THEN** the user table MUST include a `polar_customer_id` column
- **AND** the user table MUST include a `subscription_status` column (values: 'free', 'premium', 'canceled')
- **AND** the user table MUST include a `subscription_ends_at` timestamp column

#### Scenario: Subscription status query
- **WHEN** the application needs to check a user's subscription status
- **THEN** it MUST query the user's `subscription_status` field from the database
- **AND** for canceled subscriptions, it MUST compare `subscription_ends_at` with the current time

### Requirement: Error Handling and Logging
The system SHALL handle payment and webhook errors gracefully with comprehensive logging.

#### Scenario: Checkout initiation failure
- **WHEN** checkout initiation fails (network error, invalid product ID)
- **THEN** an error message MUST be displayed to the user
- **AND** the error MUST be logged with context for debugging

#### Scenario: Webhook processing failure
- **WHEN** a webhook event fails to process due to an error
- **THEN** the error MUST be logged with the full webhook payload
- **AND** an appropriate HTTP status code MUST be returned for Polar's retry logic

#### Scenario: Portal access failure
- **WHEN** customer portal access fails
- **THEN** an error message MUST be displayed to the user
- **AND** the user MUST be provided with alternative support options

### Requirement: Security and Validation
The system SHALL implement security best practices for payment processing and webhook handling.

#### Scenario: Webhook signature verification
- **WHEN** a webhook event is received
- **THEN** the webhook signature MUST be verified using the webhook secret
- **AND** events with invalid signatures MUST be rejected with a 401 status code

#### Scenario: Environment variable security
- **WHEN** Polar credentials are configured
- **THEN** access tokens and webhook secrets MUST be stored in environment variables
- **AND** credentials MUST NOT be committed to version control

#### Scenario: Authenticated checkout enforcement
- **WHEN** checkout is initiated
- **THEN** the user's authentication status MUST be verified
- **AND** unauthenticated requests MUST be rejected

### Requirement: Documentation
The system SHALL provide comprehensive documentation for Polar integration setup and maintenance.

#### Scenario: Setup documentation
- **WHEN** a developer sets up the project
- **THEN** documentation MUST explain how to obtain Polar access tokens
- **AND** documentation MUST explain how to configure webhook endpoints
- **AND** documentation MUST explain the difference between sandbox and production environments

#### Scenario: Webhook event documentation
- **WHEN** developers need to understand webhook handling
- **THEN** documentation MUST list all handled webhook events
- **AND** documentation MUST explain the business logic for each event type

#### Scenario: Troubleshooting guide
- **WHEN** issues occur with Polar integration
- **THEN** documentation MUST provide common troubleshooting steps
- **AND** documentation MUST explain how to verify webhook delivery and retry failed events
