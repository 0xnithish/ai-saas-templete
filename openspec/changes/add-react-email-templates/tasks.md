Note: Before implementing acess "React Email" docs from context 7 mcp. And for installing dependencies use "bun"

## 1. Implementation
- [x] 1.1 Add React Email dependencies to the project (e.g., `@react-email/components` and any required render utilities) alongside the existing `resend` dependency.
- [x] 1.2 Create a `VerificationEmail` React Email template that accepts the verification URL (and optional copy such as app name or user email) and renders a responsive, accessible email.
- [x] 1.3 Create a `PasswordResetEmail` React Email template that accepts the reset URL (and optional copy such as app name or user email) and renders a responsive, accessible email.
- [x] 1.4 Choose and document a directory structure for email templates (for example, `emails/VerificationEmail.tsx`, `emails/PasswordResetEmail.tsx`) consistent with project conventions.
- [x] 1.5 Update Better Auth `sendVerificationEmail` in `lib/auth.ts` to send emails via Resend using the React Email verification template (either via the `react` property or by rendering to HTML).
- [x] 1.6 Update Better Auth `sendResetPassword` in `lib/auth.ts` to send emails via Resend using the React Email password reset template.
- [x] 1.7 Verify environment variable usage (`RESEND_API_KEY`, `EMAIL_FROM`, and related Better Auth URLs) remains correct and documented in `SETUP.md` or `.env.example` if needed.
- [ ] 1.8 (Optional) Add a developer-only preview path or utility to render email templates in the browser during development.

## 2. Validation
- [ ] 2.1 Manually test sign-up flow to confirm the verification email is delivered and uses the new React Email template and that the link verifies the account successfully.
- [ ] 2.2 Manually test forgot-password/reset flow to confirm the reset email is delivered and uses the new React Email template and that the link allows password reset successfully.
- [ ] 2.3 Manually test behavior when `RESEND_API_KEY` is missing to ensure the system degrades gracefully (e.g., logs a clear warning without crashing).
- [ ] 2.4 Confirm that email content (links, expiration semantics, and sender address) matches or intentionally improves on the prior implementation.
