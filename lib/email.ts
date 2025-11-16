import { Resend } from 'resend';
import BetterAuthEmailChanged from '../emails/email-change';

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendEmailChangeParams {
  to: string;
  oldEmail: string;
  newEmail: string;
  revertLink: string;
  appName?: string;
  supportEmail?: string;
  logoUrl?: string;
}

export async function sendEmailChangeNotification({
  to,
  oldEmail,
  newEmail,
  revertLink,
  appName = process.env.APP_NAME || 'AI SaaS',
  supportEmail = process.env.SUPPORT_EMAIL || 'support@example.com',
  logoUrl = process.env.LOGO_URL || '',
}: SendEmailChangeParams) {
  try {
    const { data, error } = await resend.emails.send({
      from: `${appName} <${process.env.FROM_EMAIL || 'noreply@example.com'}>`,
      to: [to],
      subject: 'Your email address has been changed',
      react: BetterAuthEmailChanged({
        oldEmail,
        newEmail,
        revertLink,
        appName,
        supportEmail,
        logoUrl,
      }),
    });

    if (error) {
      console.error('Error sending email change notification:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error sending email change notification:', error);
    return { success: false, error };
  }
}
