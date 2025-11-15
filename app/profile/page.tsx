import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { SimpleProfile } from '@/components/profile/SimpleProfile';

export default async function ProfilePage() {
  return (
    <ProtectedRoute>
      <div className="container mx-auto py-8">
        <SimpleProfile />
      </div>
    </ProtectedRoute>
  );
}
