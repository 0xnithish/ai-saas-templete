import type { Appearance } from '@clerk/types';

export const clerkAppearance: Appearance = {
  // Global color variables that match your design system tokens
  variables: {
    colorPrimary: 'var(--primary)',
    colorBackground: 'var(--background)',
    colorInputBackground: 'var(--background)',
    colorInputText: 'var(--foreground)',
    colorText: 'var(--foreground)',
    colorTextSecondary: 'var(--muted-foreground)',
    colorBorder: 'var(--border)',
  },
  // Component-specific customizations using design tokens
  signIn: {
    elements: {
      // Card container
      card: 'bg-card text-card-foreground border-2 border-border/50 rounded-xl shadow-2xl p-6 backdrop-blur-sm',
      // Primary button (shadcn style)
      formButtonPrimary: 'bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2 px-4 rounded-lg transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 shadow-md hover:shadow-lg active:scale-[0.98]',
      // Secondary button
      formButtonSecondary: 'bg-secondary hover:bg-secondary/80 text-secondary-foreground font-medium py-2 px-4 rounded-lg transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 shadow-sm hover:shadow-md active:scale-[0.98]',
      // Input fields
      formFieldInput: 'flex h-10 w-full rounded-lg border-2 border-input/60 bg-background text-foreground px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200',
      // Password toggle button
      formFieldInputShowPasswordButton: 'text-muted-foreground hover:text-foreground transition-colors',
      formFieldInputShowPasswordIcon: 'w-4 h-4 text-muted-foreground hover:text-foreground',
      // Labels
      formFieldLabel: 'text-sm font-medium text-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
      // Social buttons
      socialButtonsBlockButton: 'inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border-2 border-input/60 bg-background hover:bg-accent hover:text-accent-foreground hover:border-accent-foreground/20 h-10 px-4 py-2 shadow-sm hover:shadow-md active:scale-[0.98] [&]:text-foreground [&>span]:text-foreground',
      // Header
      headerTitle: 'text-2xl font-semibold text-foreground leading-none tracking-tight',
      headerSubtitle: 'text-sm text-muted-foreground',
      // Footer links
      footerActionLink: 'text-primary hover:text-primary/80 underline underline-offset-4 transition-colors',
      // Root container
      rootBox: 'w-full max-w-md',
    },
  },
  signUp: {
    elements: {
      // Card container
      card: 'bg-card text-card-foreground border-2 border-border/50 rounded-xl shadow-2xl p-6 backdrop-blur-sm',
      // Primary button (shadcn style)
      formButtonPrimary: 'bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2 px-4 rounded-lg transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 shadow-md hover:shadow-lg active:scale-[0.98]',
      // Secondary button
      formButtonSecondary: 'bg-secondary hover:bg-secondary/80 text-secondary-foreground font-medium py-2 px-4 rounded-lg transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 shadow-sm hover:shadow-md active:scale-[0.98]',
      // Input fields
      formFieldInput: 'flex h-10 w-full rounded-lg border-2 border-input/60 bg-background text-foreground px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200',
      // Password toggle button
      formFieldInputShowPasswordButton: 'text-muted-foreground hover:text-foreground transition-colors',
      formFieldInputShowPasswordIcon: 'w-4 h-4 text-muted-foreground hover:text-foreground',
      // Labels
      formFieldLabel: 'text-sm font-medium text-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
      // Social buttons
      socialButtonsBlockButton: 'inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border-2 border-input/60 bg-background hover:bg-accent hover:text-accent-foreground hover:border-accent-foreground/20 h-10 px-4 py-2 shadow-sm hover:shadow-md active:scale-[0.98] [&]:text-foreground [&>span]:text-foreground',
      // Header
      headerTitle: 'text-2xl font-semibold text-foreground leading-none tracking-tight',
      headerSubtitle: 'text-sm text-muted-foreground',
      // Footer links
      footerActionLink: 'text-primary hover:text-primary/80 underline underline-offset-4 transition-colors',
      // Root container
      rootBox: 'w-full max-w-md',
    },
  },
};