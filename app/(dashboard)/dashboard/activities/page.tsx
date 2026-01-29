'use client';

import { PageShell } from '@/app/components/dashboard/PageShell';
import { useTranslation } from '@/app/hooks/useTranslation';
import { useEffect, useState } from 'react';
import { getActivities } from '@/app/actions/activities';
import { useRouter } from 'next/navigation';
import { Loader2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Activity {
  id: string;
  title: string;
  description: string | null;
  activity_date: string;
  start_time: string | null;
  end_time: string | null;
  location: string | null;
  status: string;
  team: { id: string; name: string } | null;
}

export default function ActivitiesPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchActivities() {
      const { activities: data, error: fetchError } = await getActivities();
      
      if (fetchError || !data) {
        console.error('Error fetching activities:', fetchError);
        setError(fetchError || 'Failed to load activities');
        // Demo data fallback
        setActivities([
          { 
            id: '1', 
            title: 'Trail navigation', 
            description: 'Learn basic navigation skills', 
            activity_date: '2024-03-22', 
            start_time: '09:00', 
            end_time: '12:00', 
            location: 'Mountain Trail', 
            status: 'scheduled', 
            team: { id: '1', name: 'Falcons' } 
          },
          { 
            id: '2', 
            title: 'First aid basics', 
            description: 'Essential first aid training', 
            activity_date: '2024-03-24', 
            start_time: '10:00', 
            end_time: '13:00', 
            location: 'Training Center', 
            status: 'planned', 
            team: { id: '2', name: 'Desert Hawks' } 
          },
          { 
            id: '3', 
            title: 'Night hike', 
            description: 'Overnight camping and hiking', 
            activity_date: '2024-03-28', 
            start_time: '18:00', 
            end_time: null, 
            location: 'Forest Camp', 
            status: 'draft', 
            team: { id: '3', name: 'Green Peaks' } 
          },
        ]);
        setLoading(false);
        return;
      }

      // Transform data to match Activity interface
      const transformedData: Activity[] = data.map((activity: any) => ({
        id: activity.id,
        title: activity.title,
        description: activity.description,
        activity_date: activity.activity_date,
        start_time: activity.start_time,
        end_time: activity.end_time,
        location: activity.location,
        status: activity.status,
        team: Array.isArray(activity.team) ? activity.team[0] : activity.team,
      }));
      
      setActivities(transformedData);
      setLoading(false);
    }

    fetchActivities();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
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

  return (
    <PageShell title={t('dashboard.activities.title')}>
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error} - Showing demo data
        </div>
      )}
      
      <div className="rounded-2xl border border-scout-gray-lighter bg-white p-6 shadow-sm hover:shadow-md hover:border-scout-green/30 transition-all relative overflow-hidden">
        {/* Subtle accent line */}
        <div className="absolute top-0 start-0 end-0 h-1 bg-gradient-to-e from-scout-green/40 via-scout-green-lighter/30 to-transparent" />
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-scout-green">{t('dashboard.activities.pipeline')}</h3>
          <Button size="sm" className="gap-2" onClick={() => router.push('/dashboard/activities/new')}>
            <Plus className="w-4 h-4" />
            {t('dashboard.activities.addActivity')}
          </Button>
        </div>
        
        {activities.length === 0 ? (
          <div className="text-center py-12 text-scout-gray">
            <p className="mb-4">{t('dashboard.activities.noActivities')}</p>
            <button 
              onClick={() => router.push('/dashboard/activities/new')}
              className="text-scout-green hover:text-scout-green-light hover:underline font-medium"
            >
              {t('dashboard.activities.createFirst')}
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-4">
            {activities.map((item) => (
              <div 
                key={item.id} 
                onClick={() => router.push(`/dashboard/activities/${item.id}`)}
                className="rounded-xl border border-scout-gray-lighter p-4 bg-gradient-to-br from-scout-neutral to-white hover:border-scout-green/50 hover:shadow-md transition-all group relative overflow-hidden cursor-pointer"
              >
                {/* Subtle accent on hover */}
                <div className="absolute top-0 start-0 w-full h-0.5 bg-gradient-to-e from-scout-green/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="text-scout-green font-medium mb-2 group-hover:text-scout-green-light transition-colors">{item.title}</div>
                {item.description && (
                  <div className="text-sm text-scout-gray mb-2 line-clamp-2">{item.description}</div>
                )}
                <div className="text-sm text-scout-gray mb-1">{t('dashboard.activities.date')}: {formatDate(item.activity_date)}</div>
                {item.team && (
                  <div className="text-sm text-scout-gray mb-1">{t('dashboard.activities.team')}: {item.team.name}</div>
                )}
                {item.location && (
                  <div className="text-sm text-scout-gray mb-2">{t('dashboard.activities.location')}: {item.location}</div>
                )}
                <span className="inline-flex text-xs px-3 py-1 rounded-full bg-white border border-scout-gray-lighter text-scout-gray">
                  {t(`dashboard.activities.status.${item.status}`)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageShell>
  );
}
