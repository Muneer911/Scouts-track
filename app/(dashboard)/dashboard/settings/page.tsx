'use client';

import { useState, useEffect } from 'react';
import { PageShell } from '@/app/components/dashboard/PageShell';
import { useTranslation } from '@/app/hooks/useTranslation';
import { User, Mail, Phone, Building2, Briefcase } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function SettingsPage() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);

  // Profile state - read only
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    organization_name: '',
  });

  // Fetch profile data from database
  useEffect(() => {
    async function fetchProfile() {
      const supabase = createClient();
      const { data: { user } , error } = await supabase.auth.getUser();
      
      if (error) {
        console.error('Error fetching user:', error);
        return;
      }
      
      if (user) {
        const { data: profileData, error } = await supabase
          .from('profiles')
          .select('full_name, role, organization_name, phone')
          .eq('profile_uuid', user.id)
          .single();
        
        if (error) {
          console.error('Error fetching profile:', error);
          return;
        }
        
        if (profileData) {
          setProfile({
            name: profileData.full_name || '',
            email: user.email || '',
            phone: profileData.phone || '',
            role: profileData.role || '',
            organization_name: profileData.organization_name || '',
          });
        } else {
          setProfile(prev => ({ ...prev, email: user.email || '' }));
        }
      }
      setLoading(false);
    }
    
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <PageShell title={t('dashboard.settings.title')}>
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Loading...</div>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell title={t('dashboard.settings.title')}>
      <div className="max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.settings.profile.title')}</CardTitle>
            <CardDescription>{t('dashboard.settings.profile.subtitle')}</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Avatar and Name */}
            <div className="flex items-center gap-4 mb-8 pb-6 border-b border-border">
              <div className="w-20 h-20 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center">
                <span className="text-3xl font-semibold text-primary">
                  {profile.name ? profile.name.charAt(0).toUpperCase() : 'U'}
                </span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground">{profile.name || 'User'}</h3>
                <p className="text-sm text-muted-foreground">{profile.role || 'Member'}</p>
              </div>
            </div>

            {/* Profile Details - Read Only */}
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">{t('dashboard.settings.profile.name')}</p>
                  <p className="text-sm font-medium text-foreground">{profile.name || '-'}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">{t('dashboard.settings.profile.email')}</p>
                  <p className="text-sm font-medium text-foreground" dir="ltr">{profile.email || '-'}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">{t('dashboard.settings.profile.phone')}</p>
                  <p className="text-sm font-medium text-foreground" dir="ltr">{profile.phone || '-'}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">{t('onboarding.role.title')}</p>
                  <p className="text-sm font-medium text-foreground">{profile.role || '-'}</p>
                </div>
              </div>

              {profile.organization_name && (
                <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">{t('onboarding.organizationName.title')}</p>
                    <p className="text-sm font-medium text-foreground">{profile.organization_name}</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}
