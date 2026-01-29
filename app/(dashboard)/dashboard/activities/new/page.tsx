'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/app/hooks/useTranslation';
import { createActivity } from '@/app/actions/activities';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Loader2, Plus, X } from 'lucide-react';

interface Team {
  id: string;
  name: string;
  region: string | null;
}

export default function NewActivityPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loadingTeams, setLoadingTeams] = useState(true);
  const [equipment, setEquipment] = useState<string[]>([]);
  const [newEquipment, setNewEquipment] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    activity_date: '',
    start_time: '',
    end_time: '',
    location: '',
    status: 'draft',
    team_id: '',
    max_participants: '',
    notes: '',
  });

  useEffect(() => {
    async function fetchTeams() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('team')
        .select('id, name, region')
        .order('name');

      if (error) {
        console.error('Error fetching teams:', error);
        setTeams([]);
      } else {
        setTeams(data || []);
      }
      setLoadingTeams(false);
    }

    fetchTeams();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('[NewActivityPage] Form submission started');
    console.log('[NewActivityPage] Form data:', formData);

    setLoading(true);
    setError(null);

    try {
      const activityData = {
        title: formData.title,
        description: formData.description || undefined,
        activity_date: formData.activity_date,
        start_time: formData.start_time || undefined,
        end_time: formData.end_time || undefined,
        location: formData.location || undefined,
        status: formData.status,
        team_id: formData.team_id || undefined,
        max_participants: formData.max_participants ? parseInt(formData.max_participants) : undefined,
        required_equipment: equipment.length > 0 ? equipment : undefined,
        notes: formData.notes || undefined,
      };

      console.log('[NewActivityPage] Prepared activity data:', activityData);

      const { activity, error: createError } = await createActivity(activityData);

      if (createError) {
        console.error('[NewActivityPage] Create error:', createError);
        setError(`Failed to create activity: ${createError}`);
        setLoading(false);
        return;
      }

      if (!activity) {
        console.error('[NewActivityPage] No activity returned');
        setError('Activity created but no data returned');
        setLoading(false);
        return;
      }

      console.log('[NewActivityPage] Activity created successfully:', activity);
      router.push('/dashboard/activities');
    } catch (err) {
      console.error('[NewActivityPage] Unexpected error:', err);
      setError(`Unexpected error: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setLoading(false);
    }
  };

  const addEquipment = () => {
    if (newEquipment.trim() && !equipment.includes(newEquipment.trim())) {
      setEquipment([...equipment, newEquipment.trim()]);
      setNewEquipment('');
    }
  };

  const removeEquipment = (item: string) => {
    setEquipment(equipment.filter(e => e !== item));
  };

  return (
    <div className="container mx-auto py-6 px-4 max-w-4xl">
      <Button
        variant="ghost"
        onClick={() => router.push('/dashboard/activities')}
        className="mb-6 gap-2"
      >
        <ArrowLeft className="w-4 h-4" />
        {t('dashboard.activities.backToActivities')}
      </Button>

      <div className="bg-white rounded-lg shadow-sm border border-scout-gray-lighter p-6">
        <h1 className="text-2xl font-bold text-scout-green mb-6">
          {t('dashboard.activities.newActivity')}
        </h1>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-scout-green">
              {t('dashboard.activities.basicInfo')}
            </h2>

            <div>
              <Label htmlFor="title">{t('dashboard.activities.title')} *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                placeholder={t('dashboard.activities.titlePlaceholder')}
              />
            </div>

            <div>
              <Label htmlFor="description">{t('dashboard.activities.description')}</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder={t('dashboard.activities.descriptionPlaceholder')}
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="team_id">{t('dashboard.activities.team')}</Label>
              {loadingTeams ? (
                <div className="flex items-center gap-2 text-sm text-scout-gray">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Loading teams...
                </div>
              ) : (
                <select
                  id="team_id"
                  value={formData.team_id}
                  onChange={(e) => setFormData({ ...formData, team_id: e.target.value })}
                  className="w-full px-3 py-2 border border-scout-gray-lighter rounded-md focus:outline-none focus:ring-2 focus:ring-scout-green"
                >
                  <option value="">{t('dashboard.activities.selectTeam')}</option>
                  {teams.map((team) => (
                    <option key={team.id} value={team.id}>
                      {team.name} {team.region ? `(${team.region})` : ''}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          {/* Date and Time */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-scout-green">
              {t('dashboard.activities.dateTime')}
            </h2>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="activity_date">{t('dashboard.activities.date')} *</Label>
                <Input
                  id="activity_date"
                  type="date"
                  value={formData.activity_date}
                  onChange={(e) => setFormData({ ...formData, activity_date: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="start_time">{t('dashboard.activities.startTime')}</Label>
                <Input
                  id="start_time"
                  type="time"
                  value={formData.start_time}
                  onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="end_time">{t('dashboard.activities.endTime')}</Label>
                <Input
                  id="end_time"
                  type="time"
                  value={formData.end_time}
                  onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Location and Details */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-scout-green">
              {t('dashboard.activities.details')}
            </h2>

            <div>
              <Label htmlFor="location">{t('dashboard.activities.location')}</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder={t('dashboard.activities.locationPlaceholder')}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="status">{t('dashboard.activities.status.label')} *</Label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 border border-scout-gray-lighter rounded-md focus:outline-none focus:ring-2 focus:ring-scout-green"
                  required
                >
                  <option value="draft">{t('dashboard.activities.status.draft')}</option>
                  <option value="planned">{t('dashboard.activities.status.planned')}</option>
                  <option value="scheduled">{t('dashboard.activities.status.scheduled')}</option>
                  <option value="in_progress">{t('dashboard.activities.status.in_progress')}</option>
                  <option value="completed">{t('dashboard.activities.status.completed')}</option>
                  <option value="cancelled">{t('dashboard.activities.status.cancelled')}</option>
                </select>
              </div>

              <div>
                <Label htmlFor="max_participants">{t('dashboard.activities.maxParticipants')}</Label>
                <Input
                  id="max_participants"
                  type="number"
                  min="1"
                  value={formData.max_participants}
                  onChange={(e) => setFormData({ ...formData, max_participants: e.target.value })}
                  placeholder={t('dashboard.activities.maxParticipantsPlaceholder')}
                />
              </div>
            </div>

            {/* Required Equipment */}
            <div>
              <Label htmlFor="equipment">{t('dashboard.activities.requiredEquipment')}</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  id="equipment"
                  value={newEquipment}
                  onChange={(e) => setNewEquipment(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addEquipment();
                    }
                  }}
                  placeholder={t('dashboard.activities.equipmentPlaceholder')}
                />
                <Button type="button" onClick={addEquipment} variant="outline" size="icon">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              {equipment.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {equipment.map((item, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-scout-neutral-dark rounded-full text-sm text-scout-green"
                    >
                      {item}
                      <button
                        type="button"
                        onClick={() => removeEquipment(item)}
                        className="hover:text-red-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="notes">{t('dashboard.activities.notes')}</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder={t('dashboard.activities.notesPlaceholder')}
                rows={3}
              />
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              disabled={loading}
              className="flex-1"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 me-2 animate-spin" />
                  {t('dashboard.activities.creating')}
                </>
              ) : (
                t('dashboard.activities.createActivity')
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/dashboard/activities')}
              disabled={loading}
            >
              {t('common.cancel')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
