import * as React from "react";
import { Body, Button, Container, Head, Heading, Html, Preview, Text } from "@react-email/components";
import { emailTheme } from "@/lib/email-theme";

type PasswordResetEmailProps = {
  resetUrl: string;
  userEmail?: string;
  appName?: string;
};

export function PasswordResetEmail({ resetUrl, userEmail, appName }: PasswordResetEmailProps) {
  const brand = appName ?? "AI SaaS";

  return (
    <Html>
      <Head />
      <Preview>Reset your password for {brand}</Preview>
      <Body style={bodyStyle}>
        <Container style={containerStyle}>
          <Heading style={headingStyle}>Reset your password</Heading>
          <Text style={textStyle}>
            We received a request to reset your password for {brand}. Click the button below to choose a new
            password.
          </Text>
          <Button href={resetUrl} style={buttonStyle}>
            Reset password
          </Button>
          <Text style={secondaryTextStyle}>
            If the button does not work, copy and paste this link into your browser:
          </Text>
          <Text style={linkTextStyle}>{resetUrl}</Text>
          <Text style={footerTextStyle}>
            If you did not request this change{userEmail ? ` for ${userEmail}` : ""}, you can safely ignore this
            email. For your security, this link may expire after a short period of time.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const bodyStyle: React.CSSProperties = {
  margin: 0,
  padding: "24px 0",
  backgroundColor: emailTheme.background,
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif",
};

const containerStyle: React.CSSProperties = {
  margin: "0 auto",
  padding: "32px 24px",
  maxWidth: "600px",
  backgroundColor: emailTheme.cardBackground,
  borderRadius: 12,
};

const headingStyle: React.CSSProperties = {
  fontSize: 24,
  lineHeight: "32px",
  marginBottom: 16,
  color: emailTheme.text,
};

const textStyle: React.CSSProperties = {
  fontSize: 14,
  lineHeight: "22px",
  marginBottom: 24,
  color: emailTheme.secondaryText,
};

const buttonStyle: React.CSSProperties = {
  display: "inline-block",
  padding: "12px 24px",
  backgroundImage: `linear-gradient(135deg, ${emailTheme.primary} 0%, ${emailTheme.accentForeground} 100%)`,
  color: emailTheme.primaryForeground,
  borderRadius: 8,
  textDecoration: "none",
  fontSize: 14,
  fontWeight: 600,
};

const secondaryTextStyle: React.CSSProperties = {
  fontSize: 12,
  lineHeight: "20px",
  marginTop: 24,
  marginBottom: 8,
  color: emailTheme.mutedText,
};

const linkTextStyle: React.CSSProperties = {
  fontSize: 12,
  lineHeight: "20px",
  wordBreak: "break-all",
  backgroundColor: emailTheme.linkBackground,
  padding: "8px 10px",
  borderRadius: 6,
  color: emailTheme.text,
};

const footerTextStyle: React.CSSProperties = {
  fontSize: 12,
  lineHeight: "20px",
  marginTop: 24,
  color: emailTheme.subtleText,
};

export default PasswordResetEmail;
