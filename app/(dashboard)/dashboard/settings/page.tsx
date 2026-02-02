'use client';

import { useState, useEffect, useTransition } from 'react';
import { PageShell } from '@/app/components/dashboard/PageShell';
import { useTranslation } from '@/app/hooks/useTranslation';
import { User, Mail, Phone, Building2, Briefcase, Save, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { updateProfile } from '@/app/actions/profile';
import { toast } from 'sonner';
import { LoadingSpinner } from '@/app/components/ui/loading-spinner';

export default function SettingsPage() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    organization_name: '',
  });

  useEffect(() => {
    async function fetchProfile() {
      const supabase = createClient();
      const { data: { user }, error } = await supabase.auth.getUser();

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
        }
      }
      setLoading(false);
    }

    fetchProfile();
  }, []);

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      const result = await updateProfile(formData);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(t('common.status.success'));
        // Update local state is not strictly needed as revalidatePath happens, 
        // but for immediate feedback:
        setProfile(prev => ({
          ...prev,
          name: formData.get('fullName') as string,
          phone: formData.get('phone') as string,
          organization_name: formData.get('organizationName') as string,
        }));
      }
    });
  };

  if (loading) {
    return (
      <PageShell title={t('dashboard.settings.title')}>
        <LoadingSpinner />
      </PageShell>
    );
  }

  return (
    <PageShell title={t('dashboard.settings.title')}>
      <div className="max-w-2xl">
        <form action={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>{t('dashboard.settings.profile.title')}</CardTitle>
              <CardDescription>{t('dashboard.settings.profile.subtitle')}</CardDescription>
            </CardHeader>
            <CardContent>
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

              <div className="space-y-4">
                {/* Name */}
                <div className="grid gap-2">
                  <label className="text-sm font-medium text-foreground">{t('dashboard.settings.profile.name')}</label>
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-muted-foreground" />
                    <Input
                      name="fullName"
                      defaultValue={profile.name}
                      dir="auto"
                      placeholder={t('dashboard.settings.profile.name')}
                    />
                  </div>
                </div>

                {/* Email (Read Only) */}
                <div className="grid gap-2">
                  <label className="text-sm font-medium text-foreground">{t('dashboard.settings.profile.email')}</label>
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-muted-foreground" />
                    <Input
                      disabled
                      defaultValue={profile.email}
                      dir="ltr"
                      className="bg-muted text-muted-foreground"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">{t('dashboard.settings.profile.emailHint')}</p>
                </div>

                {/* Phone */}
                <div className="grid gap-2">
                  <label className="text-sm font-medium text-foreground">{t('dashboard.settings.profile.phone')}</label>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-muted-foreground" />
                    <Input
                      name="phone"
                      defaultValue={profile.phone}
                      dir="ltr"
                      placeholder={t('dashboard.settings.profile.phone')}
                    />
                  </div>
                </div>

                {/* Role (Read Only) */}
                <div className="grid gap-2">
                  <label className="text-sm font-medium text-foreground">{t('onboarding.role.title')}</label>
                  <div className="flex items-center gap-3">
                    <Briefcase className="w-5 h-5 text-muted-foreground" />
                    <Input
                      disabled
                      defaultValue={profile.role}
                      className="bg-muted text-muted-foreground"
                    />
                  </div>
                </div>

                {/* Organization Name */}
                <div className="grid gap-2">
                  <label className="text-sm font-medium text-foreground">{t('dashboard.settings.profile.organizationName')}</label>
                  <div className="flex items-center gap-3">
                    <Building2 className="w-5 h-5 text-muted-foreground" />
                    <Input
                      name="organizationName"
                      defaultValue={profile.organization_name}
                      dir="auto"
                      placeholder={t('dashboard.settings.profile.organizationName')}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="justify-end pt-4 border-t">
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('common.status.loading')}
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    {t('common.actions.save')}
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </PageShell>
  );
}
