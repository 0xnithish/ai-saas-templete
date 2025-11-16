# Change: Integrate React Email Templates into Better Auth Email Flow

## Why
Replace the current inline HTML email templates in Better Auth with modern, maintainable React Email components for better developer experience, consistency, and easier template management.

## What Changes
- Replace inline HTML strings in `lib/auth.ts` with React Email template imports
- Integrate existing React Email templates from `better-auth/` directory
- Add email rendering utility using `@react-email/components` render function
- Update Better Auth email handlers to use rendered React components
- Maintain existing email functionality (verification, password reset, etc.)
- Preserve all existing email styling and branding

## Impact
- Affected specs: authentication
- Affected code: `lib/auth.ts`, email templates in `better-auth/` directory
- External dependencies: Uses existing `@react-email/components` dependency
- No breaking changes to API or user experience
