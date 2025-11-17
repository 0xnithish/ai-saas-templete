## ADDED Requirements

### Requirement: Use React Email for auth transactional emails
The system SHALL use React Email templates, rendered via Resend, for authentication-related transactional emails, specifically:
- Email verification messages sent as part of the Better Auth emailVerification flow.
- Password reset messages sent as part of the Better Auth reset-password flow.

React Email templates MAY be passed directly to Resend using the `react` property or rendered to HTML before being sent, but the resulting email MUST include the correct verification or reset URL provided by Better Auth.

#### Scenario: Send verification email using React Email
- **WHEN** a user signs up with email and password and triggers the verification flow
- **THEN** the system SHALL send a verification email via Resend using a React Email template
- **AND** the email SHALL contain a primary call-to-action link that uses the verification URL produced by Better Auth
- **AND** the email SHALL be sent from the configured sender address (e.g., `EMAIL_FROM`).

#### Scenario: Send password reset email using React Email
- **WHEN** a user requests a password reset and Better Auth generates a reset URL
- **THEN** the system SHALL send a password reset email via Resend using a React Email template
- **AND** the email SHALL contain a primary call-to-action link that uses the reset URL produced by Better Auth
- **AND** the email SHALL clearly communicate that the link is time-limited according to Better Auth configuration.

### Requirement: Organize auth email templates for reuse
The system SHALL store React Email templates for auth-related transactional emails in a dedicated, documented location within the codebase so that they can be easily discovered, reused, and extended.

This location SHALL:
- Group auth-related templates (at minimum, verification and password reset) together.
- Allow additional templates (e.g., welcome or subscription-related emails) to be added without changing the Better Auth configuration API surface.

#### Scenario: Locate auth email templates in a single directory
- **WHEN** a developer needs to modify the verification or password reset email content
- **THEN** they SHALL be able to find the corresponding React Email templates in the documented email templates directory without searching through unrelated files.

### Requirement: Preserve auth flow semantics when updating templates
The system SHALL preserve existing auth flow semantics when moving to React Email templates so that only presentation changes, not behavior.

Specifically:
- Verification emails MUST still use the verification URL produced by Better Auth and respect its expiry semantics.
- Password reset emails MUST still use the reset URL produced by Better Auth and respect its expiry semantics.
- Sender and recipient email addresses MUST remain aligned with existing configuration and auth flows.

#### Scenario: Preserve verification behavior with new templates
- **WHEN** a user completes email verification via a link in the new React Email-based verification email
- **THEN** the account SHALL be marked as verified exactly as in the prior implementation.

#### Scenario: Preserve password reset behavior with new templates
- **WHEN** a user completes password reset via a link in the new React Email-based reset email
- **THEN** their password SHALL be updated and the reset token invalidated exactly as in the prior implementation.
