import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

// Simple CSS variable parser for the :root block in app/globals.css
async function extractRootVars(cssPath: string): Promise<Record<string, string>> {
  const css = await readFile(cssPath, "utf8");

  const rootMatch = css.match(/:root\s*\{([\s\S]*?)\}/);
  if (!rootMatch) {
    throw new Error("Could not find :root block in app/globals.css");
  }

  const rootBlock = rootMatch[1];
  const vars: Record<string, string> = {};

  const varRegex = /--([a-z0-9-]+)\s*:\s*([^;]+);/gi;
  let match: RegExpExecArray | null;

  while ((match = varRegex.exec(rootBlock)) !== null) {
    const name = match[1].trim();
    const value = match[2].trim();
    vars[name] = value;
  }

  return vars;
}

function buildEmailThemeSource(vars: Record<string, string>): string {
  const v = (key: string, fallback: string) => (vars[key] ?? fallback).replace(/"/g, "'");

  const background = v("muted", "#f4f4f5");
  const cardBackground = v("card", "#ffffff");

  const text = v("foreground", "#333333");
  const secondaryText = v("secondary-foreground", "#4b5563");
  const mutedText = v("muted-foreground", "#6b7280");
  const subtleText = v("muted-foreground", "#9ca3af");

  const linkBackground = v("secondary", "#f3f4f6");

  const primary = v("primary", "#FB5204");
  const primaryForeground = v("primary-foreground", "#ffffff");
  const accent = v("accent", "#FFF4EC");
  const accentForeground = v("accent-foreground", "#7C2500");

  return `// AUTO-GENERATED FILE. Do not edit directly.
// Run: bun run sync:email-theme
//
// This file is generated from CSS variables in app/globals.css (:root block)
// so that email templates stay aligned with the main app brand tokens.

export const emailTheme = {
  // Base
  background: "${background}",
  cardBackground: "${cardBackground}",

  // Text colors
  text: "${text}",
  secondaryText: "${secondaryText}",
  mutedText: "${mutedText}",
  subtleText: "${subtleText}",

  // Surfaces
  linkBackground: "${linkBackground}",

  // Brand colors
  primary: "${primary}",
  primaryForeground: "${primaryForeground}",
  accent: "${accent}",
  accentForeground: "${accentForeground}",
} as const;
`;
}

async function main() {
  const cssPath = resolve("app", "globals.css");
  const themePath = resolve("lib", "email-theme.ts");

  const vars = await extractRootVars(cssPath);
  const source = buildEmailThemeSource(vars);

  await writeFile(themePath, source, "utf8");
  console.log("[sync-email-theme] Updated lib/email-theme.ts from app/globals.css");
}

main().catch((error) => {
  console.error("[sync-email-theme] Failed to sync email theme:", error);
  process.exitCode = 1;
});
