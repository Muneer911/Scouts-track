'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { PageShell } from '@/app/components/dashboard/PageShell';
import { useTranslation } from '@/app/hooks/useTranslation';
import { getTeamFullData, updatePermissionSlipStatus } from '@/app/actions/teams';
import { getReportDownloadUrl } from '@/app/actions/reports';
import {
  Users,
  ArrowLeft,
  Plus,
  Stethoscope,
  ClipboardList,
  User,
  Phone,
  Mail,
  Calendar,
  AlertCircle,
  CheckCircle,
  Clock,
  FileText,
  Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LoadingSpinner } from '@/app/components/ui/loading-spinner';

interface TeamMember {
  id: string;
  full_name: string;
  date_of_birth: string | null;
  parent_name: string | null;
  parent_phone: string | null;
  parent_email: string | null;
}

interface MedicalRecord {
  id: string;
  member_id: string;
  member_name?: string;
  blood_type: string | null;
  allergies: string | null;
  medical_conditions: string | null;
  last_checkup: string | null;
}

interface ArchivedReport {
  id: string;
  file_name: string;
  file_path: string;
  created_at: string;
  summary: string;
}

interface PermissionSlip {
  id: string;
  member_id: string;
  member_name?: string;
  activity_name: string;
  activity_date: string | null;
  status: 'pending' | 'approved' | 'denied';
}

interface Team {
  id: string;
  name: string;
  region: string | null;
  description: string | null;

}

export default function TeamDetailPage() {
  const { t } = useTranslation();
  const params = useParams();
  const router = useRouter();
  const teamId = params.teamId as string;

  const [team, setTeam] = useState<Team | null>(null);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [permissionSlips, setPermissionSlips] = useState<PermissionSlip[]>([]);
  const [archivedReports, setArchivedReports] = useState<ArchivedReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('members');
  const [updatingSlipId, setUpdatingSlipId] = useState<string | null>(null);

  const handleStatusUpdate = async (slipId: string, newStatus: 'pending' | 'approved' | 'denied') => {
    setUpdatingSlipId(slipId);
    const result = await updatePermissionSlipStatus(slipId, newStatus);

    if (result.success) {
      // Update local state
      setPermissionSlips(slips =>
        slips.map(slip =>
          slip.id === slipId ? { ...slip, status: newStatus } : slip
        )
      );
    }
    setUpdatingSlipId(null);
  };

  useEffect(() => {
    async function fetchTeamData() {
      const result = await getTeamFullData(teamId);

      if (result.error && !result.team) {
        console.error('Error fetching team:', result.error);
        // Demo data fallback
        setTeam({ id: teamId, name: 'Falcons', region: 'Riyadh', description: 'Scout team' });
        setMembers([
          { id: '1', full_name: 'Ahmed Ali', date_of_birth: '2012-05-15', parent_name: 'Ali Mohammed', parent_phone: '+966501234567', parent_email: 'ali@example.com' },
          { id: '2', full_name: 'Sara Hassan', date_of_birth: '2011-08-22', parent_name: 'Hassan Ahmed', parent_phone: '+966507654321', parent_email: 'hassan@example.com' },
          { id: '3', full_name: 'Omar Khalid', date_of_birth: '2012-01-10', parent_name: 'Khalid Omar', parent_phone: '+966509876543', parent_email: 'khalid@example.com' },
        ]);
        setMedicalRecords([
          { id: '1', member_id: '1', member_name: 'Ahmed Ali', blood_type: 'A+', allergies: 'Peanuts', medical_conditions: 'None', last_checkup: '2024-01-15' },
          { id: '2', member_id: '2', member_name: 'Sara Hassan', blood_type: 'O-', allergies: 'None', medical_conditions: 'Asthma', last_checkup: '2024-02-20' },
        ]);
        setPermissionSlips([
          { id: '1', member_id: '1', member_name: 'Ahmed Ali', activity_name: 'Camping Trip', activity_date: '2024-03-15', status: 'approved' },
          { id: '2', member_id: '2', member_name: 'Sara Hassan', activity_name: 'Camping Trip', activity_date: '2024-03-15', status: 'pending' },
          { id: '3', member_id: '3', member_name: 'Omar Khalid', activity_name: 'Camping Trip', activity_date: '2024-03-15', status: 'denied' },
        ]);
        setLoading(false);
        return;
      }

      if (result.team) {
        setTeam(result.team);
        setMembers(result.members);
        setMedicalRecords(result.medicalRecords);
        setPermissionSlips(result.permissionSlips);
        setArchivedReports(result.archivedReports);
      }

      setLoading(false);
    }

    fetchTeamData();
  }, [teamId]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'denied':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-700';
      case 'denied':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-yellow-100 text-yellow-700';
    }
  };

  if (loading) {
    return (
      <PageShell title={t('dashboard.teams.title')}>
        <LoadingSpinner />
      </PageShell>
    );
  }

  if (!team) {
    return (
      <PageShell title={t('dashboard.teams.title')}>
        <div className="text-center py-12">
          <p className="text-scout-gray">{t('dashboard.teams.notFound')}</p>
          <Button onClick={() => router.push('/dashboard/teams')} className="mt-4">
            {t('dashboard.teams.backToTeams')}
          </Button>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell title={team.name}>
      {/* Back button and header */}
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => router.push('/dashboard/teams')}
          className="mb-4 gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          {t('dashboard.teams.backToTeams')}
        </Button>

        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-scout-green">{team.name}</h2>
            <p className="text-scout-gray">
              {team.region || t('dashboard.teams.noRegion')}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="gap-2 border-amber-500/50 text-amber-700 hover:bg-amber-50"
              onClick={() => router.push(`/dashboard/teams/${teamId}/report`)}
            >
              <Stethoscope className="w-4 h-4" />
              {t('dashboard.teams.generateHealthReport')}
            </Button>
            <Button className="gap-2" onClick={() => router.push(`/dashboard/teams/${teamId}/members/new`)}>
              <Plus className="w-4 h-4" />
              {t('dashboard.teams.addMember')}
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs for Members, Medical, Permission Slips */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="members" className="gap-2">
            <Users className="w-4 h-4" />
            {t('dashboard.teams.members')} ({members.length})
          </TabsTrigger>
          <TabsTrigger value="medical" className="gap-2">
            <Stethoscope className="w-4 h-4" />
            {t('dashboard.sidebar.medical')} ({medicalRecords.length})
          </TabsTrigger>
          <TabsTrigger value="permissions" className="gap-2">
            <ClipboardList className="w-4 h-4" />
            {t('dashboard.sidebar.permissionSlips')} ({permissionSlips.length})
          </TabsTrigger>
        </TabsList>

        {/* Members Tab */}
        <TabsContent value="members">
          <div className="rounded-2xl border border-scout-gray-lighter bg-white p-6 shadow-sm">
            {members.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-scout-gray-light mx-auto mb-4" />
                <p className="text-scout-gray">{t('dashboard.teams.noMembers')}</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {members.map((member) => (
                  <div
                    key={member.id}
                    onClick={() => router.push(`/dashboard/teams/${teamId}/scouts/${member.id}`)}
                    className="flex items-center justify-between p-4 rounded-xl border border-scout-gray-lighter hover:border-scout-green/30 hover:bg-scout-green/5 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-scout-green/10 flex items-center justify-center group-hover:bg-scout-green/20 transition-colors">
                        <User className="w-6 h-6 text-scout-green" />
                      </div>
                      <div>
                        <h4 className="font-medium text-scout-green group-hover:text-scout-dark transition-colors">{member.full_name}</h4>
                        {member.date_of_birth && (
                          <p className="text-sm text-scout-gray flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(member.date_of_birth).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-end text-sm text-scout-gray">
                      {member.parent_name && (
                        <p className="flex items-center gap-1 justify-end">
                          <User className="w-3 h-3" />
                          {member.parent_name}
                        </p>
                      )}
                      {member.parent_phone && (
                        <p className="flex items-center gap-1 justify-end">
                          <Phone className="w-3 h-3" />
                          {member.parent_phone}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        {/* Medical Tab */}
        <TabsContent value="medical">
          <div className="rounded-2xl border border-scout-gray-lighter bg-white p-6 shadow-sm space-y-8">
            {/* Individual Scout Medical Records */}
            <div>
              <h3 className="text-lg font-bold text-scout-green mb-4 flex items-center gap-2">
                <Users className="w-5 h-5" />
                {t('dashboard.teams.individualRecords')}
              </h3>
              {medicalRecords.length === 0 ? (
                <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed">
                  <p className="text-scout-gray">{t('dashboard.medical.noRecords')}</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {medicalRecords.map((record) => (
                    <div
                      key={record.id}
                      className="p-4 rounded-xl border border-scout-gray-lighter hover:border-scout-green/30 transition-all"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-scout-green">{record.member_name}</h4>
                        {record.blood_type && (
                          <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                            {record.blood_type}
                          </span>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-scout-gray">{t('dashboard.medical.allergies')}</p>
                          <p className="text-scout-green">{record.allergies || 'None'}</p>
                        </div>
                        <div>
                          <p className="text-scout-gray">{t('dashboard.medical.conditions')}</p>
                          <p className="text-scout-green">{record.medical_conditions || 'None'}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Archived Team Health Reports */}
            <div className="pt-6 border-t border-slate-100">
              <h3 className="text-lg font-bold text-scout-green mb-4 flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-amber-600" />
                {t('dashboard.teams.archivedReports')}
              </h3>
              {archivedReports.length === 0 ? (
                <div className="text-center py-12 bg-amber-50/30 rounded-3xl border-2 border-dashed border-amber-100">
                  <Stethoscope className="w-12 h-12 text-amber-200 mx-auto mb-4" />
                  <p className="text-amber-800/60 font-medium">{t('dashboard.teams.noArchivedReports')}</p>
                  <p className="text-xs text-amber-800/40">{t('dashboard.teams.archivedReportsHint')}</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {archivedReports.map((report) => (
                    <div
                      key={report.id}
                      className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-amber-50/50 to-transparent border border-amber-100 hover:border-amber-300 transition-all group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-scout-green">{report.file_name}</h4>
                          <p className="text-xs text-scout-gray flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(report.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-amber-700 hover:bg-amber-100"
                        onClick={async () => {
                          const { url } = await getReportDownloadUrl(report.file_path);
                          if (url) window.open(url, '_blank');
                        }}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        {t('dashboard.teams.viewPdf')}
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Permission Slips Tab */}
        <TabsContent value="permissions">
          <div className="rounded-2xl border border-scout-gray-lighter bg-white p-6 shadow-sm">
            {permissionSlips.length === 0 ? (
              <div className="text-center py-12">
                <ClipboardList className="w-12 h-12 text-scout-gray-light mx-auto mb-4" />
                <p className="text-scout-gray">{t('dashboard.permissionSlips.noSlips')}</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {permissionSlips.map((slip) => (
                  <div
                    key={slip.id}
                    className="flex items-center justify-between p-4 rounded-xl border border-scout-gray-lighter hover:border-scout-green/30 transition-all"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium text-scout-green">{slip.member_name}</h4>
                      <p className="text-sm text-scout-gray">{slip.activity_name}</p>
                      {slip.activity_date && (
                        <p className="text-xs text-scout-gray flex items-center gap-1 mt-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(slip.activity_date).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(slip.status)}`}>
                        {getStatusIcon(slip.status)}
                        {t(`dashboard.permissionSlips.status.${slip.status}`)}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant={slip.status === 'approved' ? 'default' : 'outline'}
                          onClick={() => handleStatusUpdate(slip.id, 'approved')}
                          disabled={updatingSlipId === slip.id}
                          className="h-8"
                        >
                          <CheckCircle className="w-3 h-3 me-1" />
                          {t('dashboard.permissionSlips.approve')}
                        </Button>
                        <Button
                          size="sm"
                          variant={slip.status === 'denied' ? 'destructive' : 'outline'}
                          onClick={() => handleStatusUpdate(slip.id, 'denied')}
                          disabled={updatingSlipId === slip.id}
                          className="h-8"
                        >
                          <AlertCircle className="w-3 h-3 me-1" />
                          {t('dashboard.permissionSlips.deny')}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </PageShell>
  );
}
