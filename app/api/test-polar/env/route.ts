import { NextResponse } from 'next/server';

export async function GET() {
  const requiredEnvVars = ['POLAR_ACCESS_TOKEN', 'POLAR_WEBHOOK_SECRET'];
  const presentVars = [];
  const missingVars = [];

  for (const envVar of requiredEnvVars) {
    if (process.env[envVar]) {
      presentVars.push(envVar);
    } else {
      missingVars.push(envVar);
    }
  }

  return NextResponse.json({
    success: missingVars.length === 0,
    variables: presentVars,
    missing: missingVars,
  });
}
