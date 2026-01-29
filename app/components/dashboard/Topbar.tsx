'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from '@/app/hooks/useTranslation';
import { LanguageToggle } from '@/app/components/ui/LanguageToggle';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { createClient } from '@/lib/supabase/client';

export function Topbar() {
  const { t } = useTranslation();
  const [userName, setUserName] = useState('User');
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  useEffect(() => {
    async function fetchUserName() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('profile_uuid', user.id)
          .single();
        
        if (profile?.full_name) {
          setUserName(profile.full_name);
        }
      }
    }
    
    fetchUserName();
  }, []);

  const firstName = userName.split(' ')[0];

  return (
    <header className="border-b border-border px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {t('dashboard.greeting')}, {firstName}
          </h1>
          <p className="text-muted-foreground">
            {t('dashboard.trackProgress')}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground hidden sm:block">{formattedDate}</span>
          <LanguageToggle />
          <Avatar className="w-10 h-10 border-2 border-primary">
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {userName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
