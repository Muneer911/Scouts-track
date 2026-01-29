'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { WelcomeDashboard } from '@/app/components/dashboard/WelcomeDashboard';
import { WorkspaceCreationModal } from '@/app/components/dashboard/WorkspaceCreationModal';
import { completeOnboardingAction } from '@/app/actions/onboarding';
import { createClient } from '@/lib/supabase/client';

export default function WelcomePage() {
  const router = useRouter();
  const [showWorkspaceModal, setShowWorkspaceModal] = useState(false);
  const [userName, setUserName] = useState('User');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Try to get name from profile first, then fallback to user metadata
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('profile_uuid', user.id)
          .single();
        
        const fullName = profile?.full_name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';
        setUserName(fullName);
      }
      setLoading(false);
    }
    
    loadUser();
  }, []);

  const handleCreateWorkspace = () => {
    setShowWorkspaceModal(true);
  };

  const handleWorkspaceCreated = async (workspaceName: string) => {
    console.log('Workspace created:', workspaceName);
    setShowWorkspaceModal(false);
    
    // Mark user as fully onboarded
    await completeOnboardingAction();
    
    // Redirect to dashboard
    router.push('/dashboard');
  };

  const handleCloseModal = () => {
    setShowWorkspaceModal(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <WelcomeDashboard 
        userName={userName}
        onCreateWorkspace={handleCreateWorkspace}
      />
      <WorkspaceCreationModal
        open={showWorkspaceModal}
        onClose={handleCloseModal}
        onCreate={handleWorkspaceCreated}
      />
    </>
  );
}
