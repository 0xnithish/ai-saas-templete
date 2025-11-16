# Better Auth Email Templates

This directory contains React Email templates used by Better Auth for authentication emails.

## Overview

The email templates are built using [@react-email/components](https://react.email) and are rendered to HTML at runtime when emails are sent. This provides a modern, maintainable approach to email templating with full TypeScript support.

## Available Templates

### Active Templates (In Use)
- **PasswordReset.tsx** - Password reset email with reset link
- **VerifyEmailLink.tsx** - Email verification with clickable link

### Additional Templates (Available)
- **VerifyEmail.tsx** - Email verification with 6-digit code (alternative approach)
- **PasswordChange.tsx** - Password change confirmation
- **EmailChanged.tsx** - Email address change notification

## Customization

### 1. Design System

All templates use a centralized design system located at:
```
design-systems/better-auth/better-auth-design-system.ts
```

To customize colors, fonts, spacing, and other visual elements, edit this file. Changes will automatically apply to all email templates.

**Example customizations:**
```typescript
// Change primary button color
buttons: {
  primary: {
    backgroundColor: '#your-color',
    color: '#text-color',
  }
}

// Update text colors
colors: {
  text: {
    primary: '#your-primary-text-color',
    secondary: '#your-secondary-text-color',
  }
}
```

### 2. Template Content

To modify email content, edit the template files directly:

**Password Reset Email:**
```tsx
// better-auth/PasswordReset.tsx
export const BetterAuthPasswordReset = ({
  resetLink,
  userEmail,
  appName = 'Your App',  // Change default app name
  expirationMinutes = 60, // Change expiration time
  logoUrl,
}) => {
  // Modify JSX to change content and layout
}
```

**Email Verification:**
```tsx
// better-auth/VerifyEmailLink.tsx
export const BetterAuthVerifyEmailLink = ({
  verificationLink,
  userEmail,
  appName = 'Your App',
  expirationMinutes = 10,
  logoUrl,
}) => {
  // Modify JSX to change content and layout
}
```

### 3. Environment Variables

Configure email behavior via environment variables in `.env`:

```bash
# Email sender configuration
EMAIL_FROM="noreply@yourdomain.com"

# App branding
NEXT_PUBLIC_APP_NAME="Your App Name"
NEXT_PUBLIC_LOGO_URL="https://your-domain.com/logo.png"

# Resend API (required for sending emails)
RESEND_API_KEY="re_..."
```

## How It Works

1. **Template Definition** - Templates are React components in this directory
2. **Rendering** - `lib/email-renderer.tsx` converts React components to HTML
3. **Integration** - `lib/auth.ts` calls rendering functions and sends via Resend
4. **Styling** - Design system provides consistent theming across all templates

## Development

### Preview Templates

To preview templates during development, you can use React Email's preview server:

```bash
# Install React Email CLI (if not already installed)
npm install -g react-email

# Start preview server
react-email dev
```

This will open a browser showing all email templates with hot reload.

### Testing Changes

After modifying templates:

1. **TypeScript Check:**
   ```bash
   npx tsc --noEmit lib/email-renderer.tsx better-auth/*.tsx
   ```

2. **Test Email Sending:**
   - Trigger password reset or email verification in your app
   - Check email inbox for rendered template
   - Verify links work correctly

## Template Structure

Each template follows this structure:

```tsx
import { Body, Container, Button, ... } from '@react-email/components';
import { betterAuthDesignSystem } from '../design-systems/better-auth/better-auth-design-system';

interface TemplateProps {
  // Define props
}

export const TemplateName = (props: TemplateProps) => {
  const ds = betterAuthDesignSystem;
  
  return (
    <Html>
      <Head>
        {/* Fonts and meta */}
      </Head>
      <Body style={{ fontFamily: ds.typography.fontFamily.sans }}>
        {/* Email content using design system */}
      </Body>
    </Html>
  );
};
```

## Best Practices

1. **Always use the design system** - Don't hardcode colors or styles
2. **Test in multiple email clients** - Gmail, Outlook, Apple Mail, etc.
3. **Keep templates simple** - Complex layouts may not render consistently
4. **Use inline styles** - Email clients have limited CSS support
5. **Provide text fallbacks** - Include plain text versions of links
6. **Test responsive design** - Ensure templates work on mobile devices

## Troubleshooting

### Template not rendering
- Check that `@react-email/components` is installed: `npm list @react-email/components`
- Verify imports in `lib/email-renderer.tsx` are correct
- Check console for rendering errors

### Styles not applying
- Ensure design system is imported correctly
- Use inline styles for email client compatibility
- Check that Tailwind classes are supported by React Email

### Links not working
- Verify URL parameters are passed correctly
- Check that Better Auth base URL is configured
- Test links in actual email (not just preview)

## Additional Resources

- [React Email Documentation](https://react.email/docs)
- [Better Auth Documentation](https://better-auth.com)
- [Email Client CSS Support](https://www.caniemail.com/)
