'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { PageShell } from '@/app/components/dashboard/PageShell';
import { useTranslation } from '@/app/hooks/useTranslation';
import {
  getActivityById,
  getActivityParticipants,
  updateParticipantAttendance,
} from '@/app/actions/activities';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';

type ActivityRecord = {
  id: string;
  title: string;
  description: string | null;
  activity_date: string;
  start_time: string | null;
  end_time: string | null;
  location: string | null;
  status: string;
  team: { id: string; name: string; region: string | null } | null;
  created_by_profile: { full_name: string | null } | null;
};

type ParticipantRecord = {
  id: string;
  attendance_status: 'registered' | 'attended' | 'absent' | 'excused';
  registered_at: string;
  member: { id: string; full_name: string; date_of_birth: string | null } | null;
};

export default function ActivityDetailsPage() {
  const { t } = useTranslation();
  const params = useParams();
  const router = useRouter();

  const activityId = params.activityId as string;

  const [activity, setActivity] = useState<ActivityRecord | null>(null);
  const [participants, setParticipants] = useState<ParticipantRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingParticipantId, setUpdatingParticipantId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);

      const [{ activity: activityData, error: activityError }, { participants: participantsData, error: participantsError }] =
        await Promise.all([getActivityById(activityId), getActivityParticipants(activityId)]);

      if (activityError) {
        setError(activityError);
      }

      if (participantsError) {
        setError(participantsError);
      }

      setActivity(activityData as ActivityRecord | null);
      setParticipants((participantsData as ParticipantRecord[] | null) || []);
      setLoading(false);
    }

    fetchData();
  }, [activityId]);

  const formattedDate = useMemo(() => {
    if (!activity?.activity_date) return '';
    return new Date(activity.activity_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }, [activity?.activity_date]);

  const formattedTime = useMemo(() => {
    const start = activity?.start_time ? activity.start_time.slice(0, 5) : null;
    const end = activity?.end_time ? activity.end_time.slice(0, 5) : null;
    if (start && end) return `${start} - ${end}`;
    if (start) return start;
    return '';
  }, [activity?.start_time, activity?.end_time]);

  const onUpdateAttendance = async (participantId: string, attendance_status: ParticipantRecord['attendance_status']) => {
    setUpdatingParticipantId(participantId);
    const { participant, error: updateError } = await updateParticipantAttendance(participantId, attendance_status);

    if (updateError || !participant) {
      setUpdatingParticipantId(null);
      return;
    }

    setParticipants((prev) =>
      prev.map((p) => (p.id === participantId ? ({ ...p, attendance_status } as ParticipantRecord) : p))
    );
    setUpdatingParticipantId(null);
  };

  if (loading) {
    return (
      <PageShell title={t('dashboard.activities.title')}>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-scout-green" />
        </div>
      </PageShell>
    );
  }

  if (!activity) {
    return (
      <PageShell title={t('dashboard.activities.title')}>
        <div className="space-y-4">
          <Button variant="ghost" onClick={() => router.push('/dashboard/activities')} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            {t('dashboard.activities.backToActivities')}
          </Button>
          <div className="rounded-xl border border-scout-gray-lighter bg-white p-6">
            <div className="text-scout-gray">{error || 'Activity not found'}</div>
          </div>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell title={activity.title}>
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <Button variant="ghost" onClick={() => router.push('/dashboard/activities')} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            {t('dashboard.activities.backToActivities')}
          </Button>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>
        )}

        <div className="rounded-2xl border border-scout-gray-lighter bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-bold text-scout-green">{activity.title}</h2>
            {activity.description && <p className="text-scout-gray">{activity.description}</p>}
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-scout-gray">{t('dashboard.activities.date')}</div>
              <div className="text-scout-green font-medium">{formattedDate || '-'}</div>
            </div>
            <div>
              <div className="text-scout-gray">{t('dashboard.activities.location')}</div>
              <div className="text-scout-green font-medium">{activity.location || '-'}</div>
            </div>
            <div>
              <div className="text-scout-gray">{t('dashboard.activities.team')}</div>
              <div className="text-scout-green font-medium">{activity.team?.name || '-'}</div>
            </div>
            <div>
              <div className="text-scout-gray">{t('dashboard.activities.status.label')}</div>
              <div className="text-scout-green font-medium">{activity.status}</div>
            </div>
            {formattedTime && (
              <div>
                <div className="text-scout-gray">{t('dashboard.activities.dateTime')}</div>
                <div className="text-scout-green font-medium">{formattedTime}</div>
              </div>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-scout-gray-lighter bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-scout-green">
              {t('dashboard.teams.members')} ({participants.length})
            </h3>
          </div>

          {participants.length === 0 ? (
            <div className="text-scout-gray">{t('common.status.empty')}</div>
          ) : (
            <div className="divide-y">
              {participants.map((p) => (
                <div key={p.id} className="py-3 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <div className="text-scout-green font-medium truncate">
                      {p.member?.full_name || 'Unknown'}
                    </div>
                    <div className="text-xs text-scout-gray">{p.attendance_status}</div>
                  </div>

                  <select
                    value={p.attendance_status}
                    disabled={updatingParticipantId === p.id}
                    onChange={(e) =>
                      onUpdateAttendance(p.id, e.target.value as ParticipantRecord['attendance_status'])
                    }
                    className="px-3 py-2 border border-scout-gray-lighter rounded-md focus:outline-none focus:ring-2 focus:ring-scout-green"
                  >
                    <option value="registered">registered</option>
                    <option value="attended">attended</option>
                    <option value="absent">absent</option>
                    <option value="excused">excused</option>
                  </select>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageShell>
  );
}
