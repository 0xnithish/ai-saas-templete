  import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import { emailTheme } from "@/lib/email-theme";

type VerificationEmailProps = {
  verificationUrl: string;
  userEmail?: string;
  userName?: string;
  appName?: string;
  expirationMinutes?: number;
  logoUrl?: string;
};

export function VerificationEmail({
  verificationUrl,
  userEmail,
  userName,
  appName,
  expirationMinutes = 60,
  logoUrl = "https://0o4pg1fpby.ufs.sh/f/RSbfEU0J8DcdtpRbOh6sAUj3N86LXf57JKBqdoixIRQHecMu",
}: VerificationEmailProps) {
  const brand = appName ?? "AI SaaS";
  const previewText = `Verify your email for ${brand}`;
  const greetingName =
    (userName && userName.trim().split(/\s+/)[0]) || (userEmail ? userEmail.split("@")[0] : "there");

  return (
    <Html>
      <Head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geist" />
      </Head>
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body
          className="mx-auto my-auto px-2"
          style={{
            backgroundColor: emailTheme.background,
            fontFamily:
              "'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif",
          }}
        >
          <Container className="mx-auto my-10 max-w-[600px]">
            <Section
              className="border border-solid"
              style={{
                backgroundColor: emailTheme.cardBackground,
                borderColor: emailTheme.linkBackground,
                borderRadius: 12,
              }}
            >
              <Section className="p-8">
                <Section className="mb-8 text-center">
                  <Img
                    src={logoUrl}
                    width={48}
                    alt={`${brand} logo`}
                    className="mx-auto block"
                    style={{ display: "block", height: "auto" }}
                  />
                </Section>

                <Heading
                  className="m-0 mb-5 text-[24px] font-semibold leading-[1.3] text-center"
                  style={{ color: emailTheme.text, letterSpacing: "-0.01em" }}
                >
                  Verify your email
                </Heading>

                <Text
                  className="mt-0 mb-3 text-[16px] leading-normal"
                  style={{ color: emailTheme.secondaryText, fontWeight: 500 }}
                >
                  Hello {greetingName},
                </Text>

                <Text
                  className="mt-0 mb-5 text-[14px] leading-normal"
                  style={{ color: emailTheme.secondaryText }}
                >
                  We just need to verify your email address{" "}
                  {userEmail && <span style={{ color: emailTheme.primary }}>{userEmail}</span>} before you can access
                  your account. Click the button below to confirm your email.
                </Text>

                <Section className="my-6 text-center">
                  <Button
                    href={verificationUrl}
                    className="inline-block text-center no-underline"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      padding: "10px 24px",
                      fontSize: "14px",
                      fontWeight: 600,
                      lineHeight: "1",
                      textDecoration: "none",
                      borderRadius: 6,
                      backgroundColor: emailTheme.primary,
                      color: emailTheme.primaryForeground,
                      border: "none",
                    }}
                  >
                    Verify email
                  </Button>
                </Section>

                <Text
                  className="mt-5 mb-3 text-[12px] leading-normal"
                  style={{ color: emailTheme.mutedText, fontWeight: 500 }}
                >
                  Or copy and paste this URL into your browser:
                </Text>

                <Text
                  className="mt-0 mb-5 break-all text-[12px] leading-normal"
                  style={{ color: emailTheme.primary, wordBreak: "break-all" }}
                >
                  {verificationUrl}
                </Text>

                <Hr
                  className="mx-0 my-6 w-full border border-solid"
                  style={{ borderColor: emailTheme.linkBackground }}
                />

                <Text
                  className="mt-0 mb-3 text-[12px] leading-normal"
                  style={{ color: emailTheme.mutedText }}
                >
                  This link may expire after a short period of time. Email sent by {brand}.
                </Text>

                <Text
                  className="mt-3 mb-4 text-[12px] leading-normal"
                  style={{ color: emailTheme.mutedText }}
                >
                  If you didn't sign up for {brand}, you can safely ignore this email. Someone else might have typed
                  your email address by mistake.
                </Text>
              </Section>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

export default VerificationEmail;
