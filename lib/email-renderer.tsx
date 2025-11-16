import { render } from '@react-email/components';
import { BetterAuthPasswordReset } from '../better-auth/PasswordReset';
import { BetterAuthVerifyEmailLink } from '../better-auth/VerifyEmailLink';

/**
 * Email rendering utility for Better Auth email templates
 * Converts React Email components to HTML strings for sending via Resend
 */

interface PasswordResetEmailProps {
  resetLink: string;
  userEmail: string;
  appName?: string;
  expirationMinutes?: number;
  logoUrl?: string;
}

interface VerifyEmailProps {
  verificationLink: string;
  userEmail: string;
  appName?: string;
  expirationMinutes?: number;
  logoUrl?: string;
}

/**
 * Renders the password reset email template to HTML
 */
export async function renderPasswordResetEmail(props: PasswordResetEmailProps): Promise<string> {
  return render(
    <BetterAuthPasswordReset
      resetLink={props.resetLink}
      userEmail={props.userEmail}
      appName={props.appName || 'Your App'}
      expirationMinutes={props.expirationMinutes || 60}
      logoUrl={props.logoUrl}
    />
  );
}

/**
 * Renders the email verification template to HTML
 * Uses URL-based verification link matching Better Auth's flow
 */
export async function renderVerifyEmail(props: VerifyEmailProps): Promise<string> {
  return render(
    <BetterAuthVerifyEmailLink
      verificationLink={props.verificationLink}
      userEmail={props.userEmail}
      appName={props.appName || 'Your App'}
      expirationMinutes={props.expirationMinutes || 10}
      logoUrl={props.logoUrl}
    />
  );
}
