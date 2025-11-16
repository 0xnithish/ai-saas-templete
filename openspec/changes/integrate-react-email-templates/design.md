## Context
The current Better Auth email implementation uses inline HTML strings for email templates in `lib/auth.ts`. This approach is hard to maintain, test, and customize. The project already has React Email templates installed in the `better-auth/` directory but they are not integrated into the email flow.

## Goals / Non-Goals
- Goals: 
  - Replace inline HTML with React Email components
  - Maintain all existing email functionality
  - Improve template maintainability and customization
  - Use existing React Email dependencies
- Non-Goals:
  - Change email content or branding
  - Modify email sending logic
  - Add new email types beyond existing ones

## Decisions
- Decision: Use `@react-email/components` render function to convert React components to HTML strings
- Rationale: This maintains compatibility with existing Resend integration while leveraging React Email's component-based approach
- Decision: Keep existing email handler structure in Better Auth
- Rationale: Minimal changes to authentication flow, reduces risk of breaking changes
- Decision: Import templates from `better-auth/` directory
- Rationale: Templates are already created and follow React Email patterns

## Risks / Trade-offs
- Risk: Rendering performance impact from React component compilation
  Mitigation: Server-side rendering is fast and cached; templates are simple
- Risk: TypeScript type issues with template props
  Mitigation: Templates already have proper TypeScript interfaces
- Trade-off: Slight increase in bundle size for email rendering
  Benefit: Much better developer experience and maintainability

## Migration Plan
1. Create email rendering utility function
2. Update password reset email handler
3. Update email verification handler  
4. Test email functionality end-to-end
5. Remove old inline HTML templates

## Open Questions
- Should we add error handling for template rendering failures?
- Do we need to support plain text fallbacks for email clients?
