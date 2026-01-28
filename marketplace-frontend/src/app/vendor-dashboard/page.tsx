'use client';

import { VendorDashboard } from '@/components/VendorDashboard';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Page() {
  const { user, isVendor, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || !isVendor)) {
      router.push('/');
    }
  }, [user, isVendor, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return <VendorDashboard />;
}
