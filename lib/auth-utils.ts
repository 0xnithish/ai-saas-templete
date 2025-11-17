import { auth } from "@/lib/auth";
import { headers } from "next/headers";

/**
 * Get session with cookie cache bypassed
 * Use this when you need to ensure fresh session data from database
 */
export async function getSessionWithoutCache() {
  return await auth.api.getSession({
    headers: await headers(),
    query: {
      disableCookieCache: true,
    },
  });
}

/**
 * Get session with optional cache bypass
 * @param bypassCache - Set to true to bypass cookie cache and fetch from database
 */
export async function getSession(bypassCache = false) {
  if (bypassCache) {
    return await getSessionWithoutCache();
  }
  
  return await auth.api.getSession({
    headers: await headers(),
  });
}
