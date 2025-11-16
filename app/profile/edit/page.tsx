import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { ProfileEdit } from '@/components/profile/ProfileEdit';

export default async function EditProfilePage() {
  return (
    <ProtectedRoute>
      <div className="container mx-auto py-8">
        <ProfileEdit />
      </div>
    </ProtectedRoute>
  );
}
