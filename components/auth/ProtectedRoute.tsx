import { getSession } from "@/lib/auth-utils";
import { redirect } from "next/navigation";

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

/**
 * Server component that protects routes by checking authentication
 * Usage: Wrap your page content with this component
 * 
 * Example:
 * ```tsx
 * export default async function DashboardPage() {
 *   return (
 *     <ProtectedRoute>
 *       <YourDashboardContent />
 *     </ProtectedRoute>
 *   );
 * }
 * ```
 */
export async function ProtectedRoute({ 
  children, 
  redirectTo = "/sign-in" 
}: ProtectedRouteProps) {
  const session = await getSession();

  if (!session?.user) {
    redirect(redirectTo);
  }

  return <>{children}</>;
}
