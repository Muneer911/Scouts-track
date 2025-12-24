'use client';

import { PageShell } from '@/app/components/dashboard/PageShell';
import { useTranslation } from '@/app/hooks/useTranslation';

const teams = [
  { name: 'Falcons', members: 24, lead: 'Sarah Ahmed', region: 'Riyadh' },
  { name: 'Desert Hawks', members: 18, lead: 'Omar Ali', region: 'Jeddah' },
  { name: 'Green Peaks', members: 22, lead: 'Laila Noor', region: 'Dammam' },
];

export default function TeamsPage() {
  const { t } = useTranslation();

  return (
    <PageShell title={t('dashboard.teams.title')}>
      <div className="rounded-2xl border border-scout-gray-lighter bg-white p-6 shadow-sm hover:shadow-md hover:border-scout-green/30 transition-all relative overflow-hidden">
        {/* Subtle accent line */}
        <div className="absolute top-0 start-0 end-0 h-1 bg-gradient-to-e from-scout-green/40 via-scout-green-lighter/30 to-transparent" />
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-scout-green">{t('dashboard.teams.directory')}</h3>
          <button className="text-sm text-scout-green hover:text-scout-green-light hover:underline transition-colors font-medium">{t('dashboard.teams.addTeam')}</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-start text-sm text-scout-gray">
            <thead>
              <tr className="text-scout-gray uppercase text-xs tracking-wide">
                <th className="py-3 text-start">{t('dashboard.teams.team')}</th>
                <th className="py-3 text-start">{t('dashboard.teams.members')}</th>
                <th className="py-3 text-start">{t('dashboard.teams.lead')}</th>
                <th className="py-3 text-start">{t('dashboard.teams.region')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-scout-gray-lighter">
              {teams.map((team) => (
                <tr key={team.name} className="hover:bg-scout-green/5 transition-colors cursor-pointer">
                  <td className="py-3 font-medium text-scout-green hover:text-scout-green-light transition-colors">{team.name}</td>
                  <td className="py-3">{team.members}</td>
                  <td className="py-3">{team.lead}</td>
                  <td className="py-3">{team.region}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </PageShell>
  );
}
