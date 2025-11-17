import { getSession } from "@/lib/auth-utils";

export async function getServerSession() {
  try {
    const session = await getSession();
    return session;
  } catch (error) {
    console.error("Failed to get server session:", error);
    return null;
  }
}
