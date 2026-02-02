'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PageShell } from '@/app/components/dashboard/PageShell';
import { useTranslation } from '@/app/hooks/useTranslation';
import { getTeamsWithMemberCounts } from '@/app/actions/teams';
import { Users, Plus, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/app/components/ui/loading-spinner';

interface Team {
  id: string;
  name: string;
  region: string | null;
  description: string | null;
  supervisor: {
    full_name: string | null;
  } | null;
  member_count: number;
}

export default function TeamsPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTeams() {
      const { teams: teamsData, error } = await getTeamsWithMemberCounts();

      if (error && !teamsData) {
        console.error('Error fetching teams:', error);
        // Use demo data if fetch fails so UI can still render
        setTeams([
          { id: '1', name: 'Falcons', region: 'Riyadh', description: null, supervisor: null, member_count: 24 },
          { id: '2', name: 'Desert Hawks', region: 'Jeddah', description: null, supervisor: null, member_count: 18 },
          { id: '3', name: 'Green Peaks', region: 'Dammam', description: null, supervisor: null, member_count: 22 },
        ]);
        setLoading(false);
        return;
      }

      if (teamsData) {
        setTeams(teamsData);
      }

      setLoading(false);
    }

    fetchTeams();
  }, []);

  const handleTeamClick = (teamId: string) => {
    router.push(`/dashboard/teams/${teamId}`);
  };

  if (loading) {
    return (
      <PageShell title={t('dashboard.teams.title')}>
        <LoadingSpinner />
      </PageShell>
    );
  }

  return (
    <PageShell title={t('dashboard.teams.title')}>
      <div className="rounded-2xl border border-scout-gray-lighter bg-white p-6 shadow-sm hover:shadow-md hover:border-scout-green/30 transition-all relative overflow-hidden">
        {/* Subtle accent line */}
        <div className="absolute top-0 start-0 end-0 h-1 bg-gradient-to-e from-scout-green/40 via-scout-green-lighter/30 to-transparent" />
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-scout-green">{t('dashboard.teams.directory')}</h3>
          <Button size="sm" className="gap-2" onClick={() => router.push('/dashboard/teams/new')}>
            <Plus className="w-4 h-4" />
            {t('dashboard.teams.addTeam')}
          </Button>
        </div>

        {teams.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-scout-gray-light mx-auto mb-4" />
            <p className="text-scout-gray">{t('dashboard.teams.noTeams')}</p>
            <Button className="mt-4 gap-2" onClick={() => router.push('/dashboard/teams/new')}>
              <Plus className="w-4 h-4" />
              {t('dashboard.teams.createFirst')}
            </Button>
          </div>
        ) : (
          <div className="grid gap-4">
            {teams.map((team) => (
              <div
                key={team.id}
                onClick={() => handleTeamClick(team.id)}
                className="flex items-center justify-between p-4 rounded-xl border border-scout-gray-lighter hover:border-scout-green/30 hover:bg-scout-green/5 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-scout-green/10 flex items-center justify-center">
                    <Users className="w-6 h-6 text-scout-green" />
                  </div>
                  <div>
                    <h4 className="font-medium text-scout-green group-hover:text-scout-green-light transition-colors">
                      {team.name}
                    </h4>
                    <p className="text-sm text-scout-gray">
                      {team.supervisor?.full_name || t('dashboard.teams.noSupervisor')} • {team.region || t('dashboard.teams.noRegion')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-end">
                    <p className="text-lg font-semibold text-scout-green">{team.member_count}</p>
                    <p className="text-xs text-scout-gray">{t('dashboard.teams.members')}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-scout-gray-light group-hover:text-scout-green transition-colors" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageShell>
  );
}
