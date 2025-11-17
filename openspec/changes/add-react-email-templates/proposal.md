# Change: Integrate React Email templates for auth emails

## Why
Current auth emails (verification and password reset) are sent via Resend using inline HTML strings inside Better Auth callbacks. This makes templates harder to maintain, harder to iterate on visually, and less reusable for future transactional emails.

React Email provides a React-based way to build responsive, accessible email templates that work well with Resend. Using React Email will make templates easier to evolve, share styling, and extend to future flows while keeping the existing auth behavior intact.

## What Changes
- Introduce React Email as the templating layer for transactional auth emails sent through Resend.
- Define dedicated React Email components for:
  - Email verification (Better Auth email verification flow).
  - Password reset (Better Auth reset-password flow).
- Update Better Auth email callbacks to send emails via Resend using React Email templates instead of inline HTML strings.
- Establish a simple, documented structure for where email templates live in the codebase so additional templates (e.g., welcome emails, billing notifications) can be added later.
- Keep public behavior the same for end users (same flows, links, and expiry semantics) while improving implementation quality.

## Impact
- Affected specs:
  - `email` (new capability for transactional auth emails using React Email + Resend).
- Affected code (for later implementation, not in this proposal):
  - `lib/auth.ts` (Better Auth configuration: `sendResetPassword`, `sendVerificationEmail`).
  - New email template components (e.g., `emails/VerificationEmail.tsx`, `emails/PasswordResetEmail.tsx` or equivalent path).
- External dependencies:
  - React Email packages (e.g. `@react-email/components` and related utilities) alongside existing `resend` usage.
- No intentional breaking changes to user-visible flows:
  - Verification and reset emails continue to be delivered via Resend.
  - Links keep their current behavior and expiry semantics defined by Better Auth.
