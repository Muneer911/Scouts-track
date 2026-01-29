'use client';

import { useTranslation } from '@/app/hooks/useTranslation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, FolderPlus, Users, Settings, Sparkles } from 'lucide-react';

interface WelcomeDashboardProps {
  userName: string;
  onCreateWorkspace: () => void;
}

export function WelcomeDashboard({ userName, onCreateWorkspace }: WelcomeDashboardProps) {
  const { t } = useTranslation();
  const firstName = userName.split(' ')[0];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-semibold text-foreground">{t('nav.brand')}</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-sm font-medium text-primary">
                {firstName.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4 text-balance">
            {t('dashboard.welcome.title')}, {firstName}!
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            {t('dashboard.welcome.subtitle')}
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-12">
          {/* Primary Action - Create Workspace */}
          <Card className="col-span-full lg:col-span-1 border-primary/50 bg-primary/5">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center mb-4">
                <FolderPlus className="w-6 h-6 text-primary-foreground" />
              </div>
              <CardTitle className="text-foreground">{t('dashboard.welcome.createWorkspace')}</CardTitle>
              <CardDescription>
                {t('dashboard.welcome.createWorkspaceDesc')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={onCreateWorkspace} className="w-full gap-2">
                <Plus className="w-4 h-4" />
                {t('dashboard.welcome.createButton')}
              </Button>
            </CardContent>
          </Card>

          {/* Secondary Actions */}
          <Card className="bg-card">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-secondary-foreground" />
              </div>
              <CardTitle className="text-foreground">{t('dashboard.welcome.inviteTeam')}</CardTitle>
              <CardDescription>
                {t('dashboard.welcome.inviteTeamDesc')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="secondary" className="w-full" disabled>
                {t('dashboard.welcome.comingSoon')}
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-card">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center mb-4">
                <Settings className="w-6 h-6 text-secondary-foreground" />
              </div>
              <CardTitle className="text-foreground">{t('dashboard.welcome.configureSettings')}</CardTitle>
              <CardDescription>
                {t('dashboard.welcome.configureSettingsDesc')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="secondary" className="w-full" disabled>
                {t('dashboard.welcome.comingSoon')}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Getting Started Guide */}
        <Card className="bg-card">
          <CardHeader>
            <CardTitle className="text-foreground">{t('dashboard.welcome.gettingStarted')}</CardTitle>
            <CardDescription>{t('dashboard.welcome.gettingStartedDesc')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
                  <span className="text-sm font-medium text-primary-foreground">1</span>
                </div>
                <div>
                  <h4 className="font-medium text-foreground">{t('dashboard.welcome.step1Title')}</h4>
                  <p className="text-sm text-muted-foreground">
                    {t('dashboard.welcome.step1Desc')}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                  <span className="text-sm font-medium text-muted-foreground">2</span>
                </div>
                <div>
                  <h4 className="font-medium text-foreground">{t('dashboard.welcome.step2Title')}</h4>
                  <p className="text-sm text-muted-foreground">
                    {t('dashboard.welcome.step2Desc')}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                  <span className="text-sm font-medium text-muted-foreground">3</span>
                </div>
                <div>
                  <h4 className="font-medium text-foreground">{t('dashboard.welcome.step3Title')}</h4>
                  <p className="text-sm text-muted-foreground">
                    {t('dashboard.welcome.step3Desc')}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
