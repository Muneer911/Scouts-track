import { ReactNode } from 'react';
import { requireAuth } from '@/lib/auth';
import { Sidebar } from '@/app/components/dashboard/Sidebar';
import { Topbar } from '@/app/components/dashboard/Topbar';

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  await requireAuth(); // Redirects to /login when no session
  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <Topbar />
        {children}
      </main>
    </div>
  );
}

