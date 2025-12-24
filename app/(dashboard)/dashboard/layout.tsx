import { ReactNode } from 'react';
import { requireAuth } from '@/lib/auth';

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  await requireAuth(); // Redirects to /login when no session
  return <>{children}</>;
}

