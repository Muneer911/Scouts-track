'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PageShell } from '@/app/components/dashboard/PageShell';
import { useTranslation } from '@/app/hooks/useTranslation';
import { createTeam } from '@/app/actions/teams';
import { ArrowLeft, Users, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function NewTeamPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    region: '',
    description: '',
    age_range_min: '',
    age_range_max: '',
    meeting_schedule: '',
    objectives: '',
    max_capacity: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const teamData = {
        name: formData.name,
        region: formData.region || null,
        description: formData.description || null,
        age_range_min: formData.age_range_min ? parseInt(formData.age_range_min) : null,
        age_range_max: formData.age_range_max ? parseInt(formData.age_range_max) : null,
        meeting_schedule: formData.meeting_schedule || null,
        objectives: formData.objectives || null,
        max_capacity: formData.max_capacity ? parseInt(formData.max_capacity) : null,
      };

      const { team, error: createError } = await createTeam(teamData);

      if (createError) {
        setError(`Failed to create team: ${createError}`);
        setLoading(false);
        return;
      }

      if (!team) {
        setError('Team created but no data returned');
        setLoading(false);
        return;
      }

      router.push(`/dashboard/teams/${team.id}`);
    } catch (err) {
      console.error('Error:', err);
      setError(`Unexpected error: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setLoading(false);
    }
  };

  return (
    <PageShell title={t('dashboard.teams.newTeam')}>
      {/* Back button */}
      <Button
        variant="ghost"
        onClick={() => router.push('/dashboard/teams')}
        className="mb-6 gap-2"
      >
        <ArrowLeft className="w-4 h-4" />
        {t('dashboard.teams.backToTeams')}
      </Button>

      <div className="max-w-2xl">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <CardTitle>{t('dashboard.teams.newTeam')}</CardTitle>
                <CardDescription>{t('dashboard.teams.newTeamDescription')}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-6 rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">{t('dashboard.teams.teamName')} *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder={t('dashboard.teams.teamNamePlaceholder')}
                  required
                  dir="auto"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="region">{t('dashboard.teams.region')}</Label>
                <Input
                  id="region"
                  value={formData.region}
                  onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                  placeholder={t('dashboard.teams.regionPlaceholder')}
                  dir="auto"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">{t('dashboard.teams.description')}</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder={t('dashboard.teams.descriptionPlaceholder')}
                  rows={4}
                  dir="auto"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="age_range_min">{t('dashboard.teams.ageRangeMin')}</Label>
                  <Input
                    id="age_range_min"
                    type="number"
                    value={formData.age_range_min}
                    onChange={(e) => setFormData({ ...formData, age_range_min: e.target.value })}
                    placeholder="6"
                    min="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age_range_max">{t('dashboard.teams.ageRangeMax')}</Label>
                  <Input
                    id="age_range_max"
                    type="number"
                    value={formData.age_range_max}
                    onChange={(e) => setFormData({ ...formData, age_range_max: e.target.value })}
                    placeholder="12"
                    min="0"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="meeting_schedule">{t('dashboard.teams.meetingSchedule')}</Label>
                <Input
                  id="meeting_schedule"
                  value={formData.meeting_schedule}
                  onChange={(e) => setFormData({ ...formData, meeting_schedule: e.target.value })}
                  placeholder={t('dashboard.teams.meetingSchedulePlaceholder')}
                  dir="auto"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="objectives">{t('dashboard.teams.objectives')}</Label>
                <Textarea
                  id="objectives"
                  value={formData.objectives}
                  onChange={(e) => setFormData({ ...formData, objectives: e.target.value })}
                  placeholder={t('dashboard.teams.objectivesPlaceholder')}
                  rows={3}
                  dir="auto"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="max_capacity">{t('dashboard.teams.maxCapacity')}</Label>
                <Input
                  id="max_capacity"
                  type="number"
                  value={formData.max_capacity}
                  onChange={(e) => setFormData({ ...formData, max_capacity: e.target.value })}
                  placeholder="30"
                  min="1"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/dashboard/teams')}
                  disabled={loading}
                >
                  {t('common.actions.cancel')}
                </Button>
                <Button type="submit" disabled={loading || !formData.name} className="gap-2">
                  <Save className="w-4 h-4" />
                  {loading ? t('common.actions.saving') : t('dashboard.teams.saveTeam')}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}
