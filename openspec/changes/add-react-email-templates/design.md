## Context
- The project already uses Better Auth for email/password authentication with verification and password reset, backed by Resend for email delivery.
- Current email content is implemented as inline HTML strings inside Better Auth callbacks in `lib/auth.ts`.
- React Email offers a React/JSX-based way to build email templates that integrate cleanly with Resend via either:
  - Passing a `react` component directly to `resend.emails.send`, or
  - Rendering React Email components to HTML using utilities like `@react-email/render` or `@react-email/components` and passing the resulting HTML to Resend.

This change introduces React Email as an internal implementation detail for composing email bodies while keeping Better Auth and Resend as the orchestration and delivery layers.

## Goals / Non-Goals
- Goals:
  - Use React Email templates for auth-related transactional emails (verification, password reset).
  - Improve maintainability and readability of email content by moving away from large inline HTML strings.
  - Provide a clear, extensible pattern for adding future transactional email templates.
- Non-Goals:
  - Introduce a generic visual email builder or WYSIWYG UI.
  - Change the high-level auth flow (sign-up, verification, reset-password URLs and expiry rules remain governed by Better Auth).
  - Implement marketing/broadcast email capabilities.

## Decisions
- **Use React Email components for template composition**
  - Define React components (e.g., `VerificationEmail`, `PasswordResetEmail`) using `@react-email/components` primitives (`Html`, `Body`, `Text`, `Button`, etc.).
  - Co-locate templates under a dedicated directory (e.g., `emails/` or `app/emails/`) to make them easy to find and extend.

- **Integrate React Email with Resend via Resend SDK**
  - Continue to use the existing `Resend` instance initialized in `lib/auth.ts`.
  - For each Better Auth callback:
    - Either pass the React component via the `react` property on `resend.emails.send`, *or*
    - Render the React Email component to HTML and pass the `html` field.
  - Keep `from`, `to`, and `subject` behavior aligned with current implementation and environment variables (e.g., `EMAIL_FROM`).

- **Keep Better Auth as the orchestration layer**
  - The Better Auth config continues to own when and how emails are triggered.
  - Email templates are responsible only for presentation and interpolating parameters like `url`.

- **Enable future extension**
  - The same approach can be reused for future templates (welcome emails, subscription-related notifications) without changing core auth flows.

## Risks / Trade-offs
- **Additional dependency and build footprint**
  - React Email adds packages and JSX-based templates, slightly increasing bundle size on the server side.
  - Mitigation: Keep email templates small and focused; use only necessary React Email components.

- **Template rendering performance**
  - Rendering React components to HTML is slightly more expensive than interpolating strings.
  - Mitigation: Auth email volume is typically low per user (verification, occasional reset), so the impact is acceptable. If needed, templates can be optimized later.

- **HTML differences between old and new templates**
  - The visual layout and markup may change when moving to React Email.
  - Mitigation: Preserve the same core content and links, and validate rendering in common email clients during implementation.

## Migration Plan
1. Introduce React Email dependencies.
2. Implement React Email templates for verification and password reset emails, ensuring they accept required props (`url`, `userEmail`, etc.).
3. Update Better Auth callbacks in `lib/auth.ts` to use these templates via Resend.
4. Manually test end-to-end flows:
   - Sign up → receive verification email → verify link works.
   - Forgot password → receive reset email → reset link works.
5. Remove or archive the old inline HTML strings once new templates are verified.

## Open Questions
- Should we add a developer-only preview route or story (e.g., `/dev/email-preview`) to inspect templates in the browser during development?
- Do we need a shared design system for email styles (e.g., consistent header/footer across all transactional emails), or is a minimal, focused design sufficient for this template pass?
