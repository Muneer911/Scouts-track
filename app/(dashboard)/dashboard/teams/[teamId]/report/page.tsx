'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { PageShell } from '@/app/components/dashboard/PageShell';
import { useTranslation } from '@/app/hooks/useTranslation';
import { getTeamById } from '@/app/actions/teams';
import { saveHealthReportMetadata, uploadHealthReportPdf } from '@/app/actions/reports';
import { revalidateDashboard } from '@/app/actions/dashboard';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    ArrowLeft,
    FileText,
    Download,
    RefreshCw,
    AlertCircle,
    CheckCircle2,
    Stethoscope,
    Users
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

interface HealthReport {
    summary: string;
    members: any[];
}

export default function TeamReportPage() {
    const { t } = useTranslation();
    const params = useParams();
    const router = useRouter();
    const teamId = params.teamId as string;

    const [loading, setLoading] = useState(false);
    const [report, setReport] = useState<HealthReport | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [teamName, setTeamName] = useState<string>('');

    useEffect(() => {
        async function fetchTeam() {
            const { team } = await getTeamById(teamId);
            if (team) setTeamName(team.name);
        }
        fetchTeam();
    }, [teamId]);

    const generateReport = async () => {
        setLoading(true);
        setError(null);
        try {
            const supabase = createClient();
            const { data: { session } } = await supabase.auth.getSession();

            const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/team-health-report`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session?.access_token || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
                    'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
                },
                body: JSON.stringify({ teamId }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Server responded with ${response.status}`);
            }

            const data = await response.json();
            console.log('Received data:', data);

            if (!data.summary) {
                throw new Error('AI analysis failed to generate a summary. Please try again.');
            }

            setReport(data);

            // AUTOMATIC PDF GENERATION & STORAGE
            const doc = new jsPDF();
            const timestamp = new Date().toLocaleDateString();

            // PDF Styling and Content
            doc.setFontSize(22);
            doc.setTextColor(22, 101, 52);
            doc.text('Team health summary', 14, 22);
            doc.setFontSize(12);
            doc.setTextColor(100);
            doc.text(`Team: ${teamName}`, 14, 32);
            doc.text(`Date Generated: ${timestamp}`, 14, 38);

            doc.setFontSize(16);
            doc.setTextColor(0);
            doc.text('Medical Officer Analysis', 14, 52);
            doc.setFontSize(10);
            const splitSummary = doc.splitTextToSize(data.summary, 180);
            doc.text(splitSummary, 14, 60);

            const startY = 60 + (splitSummary.length * 5) + 10;
            doc.setFontSize(16);
            doc.text('Detailed Member Records', 14, startY);

            autoTable(doc, {
                startY: startY + 5,
                head: [['Name', 'Blood', 'Allergies', 'Conditions', 'Doctor']],
                body: (data.members || []).map((m: any) => [
                    m.full_name,
                    m.blood_type || '-',
                    m.allergies || '-',
                    m.medical_conditions || '-',
                    `${m.doctor_name || '-'}\n${m.doctor_phone || '-'}`
                ]),
                headStyles: { fillColor: [243, 244, 246], textColor: [31, 41, 55], fontStyle: 'bold' },
                styles: { fontSize: 8, cellPadding: 3 },
            });

            const fileName = `${teamName.replace(/\s+/g, '_')}_Health_Report_${Date.now()}.pdf`;
            const pdfBlob = doc.output('blob');

            // 1. Upload to Storage
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('health-reports')
                .upload(`${teamId}/${fileName}`, pdfBlob);

            if (uploadError) throw uploadError;

            // 2. Save Metadata
            const { error: dbError } = await supabase
                .from('team_health_reports')
                .insert({
                    team_id: teamId,
                    file_path: uploadData.path,
                    file_name: fileName,
                    summary: data.summary
                });

            if (dbError) throw dbError;

            await revalidateDashboard();

            // Optional: You could add a success toast here
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Failed to generate report');
        } finally {
            setLoading(false);
        }
    };

    const downloadPDF = () => {
        if (!report) return;

        const doc = new jsPDF();
        const timestamp = new Date().toLocaleDateString();

        doc.setFontSize(22);
        doc.setTextColor(22, 101, 52);
        doc.text('Team health summary', 14, 22);

        doc.setFontSize(12);
        doc.setTextColor(100);
        doc.text(`Team: ${teamName}`, 14, 32);
        doc.text(`Date Generated: ${timestamp}`, 14, 38);

        const splitSummary = doc.splitTextToSize(report.summary, 180);
        doc.setFontSize(10);
        doc.setTextColor(0);
        doc.text(splitSummary, 14, 60);

        const startY = 60 + (splitSummary.length * 5) + 10;
        autoTable(doc, {
            startY: startY + 5,
            head: [['Name', 'Blood', 'Allergies', 'Conditions', 'Doctor']],
            body: (report.members || []).map(m => [
                m.full_name,
                m.blood_type || '-',
                m.allergies || '-',
                m.medical_conditions || '-',
                `${m.doctor_name || '-'}\n${m.doctor_phone || '-'}`
            ]),
            headStyles: { fillColor: [243, 244, 246], textColor: [31, 41, 55], fontStyle: 'bold' },
            styles: { fontSize: 8, cellPadding: 3 },
        });

        doc.save(`${teamName.replace(/\s+/g, '_')}_Health_Report.pdf`);
    };

    return (
        <PageShell title="Health Analytics">
            <div className="max-w-4xl mx-auto space-y-6">
                <Button
                    variant="ghost"
                    onClick={() => router.back()}
                    className="gap-2"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Team
                </Button>

                <Card className="border-none shadow-xl shadow-black/[0.03] bg-gradient-to-br from-white to-emerald-50/20">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
                        <div>
                            <CardTitle className="text-2xl font-black text-emerald-950 flex items-center gap-2">
                                <Stethoscope className="w-6 h-6 text-emerald-600" />
                                Team Health Intelligence
                            </CardTitle>
                            <p className="text-emerald-700/60 font-medium mt-1">Medical evaluation for {teamName}</p>
                        </div>
                        {!report && (
                            <Button
                                onClick={generateReport}
                                disabled={loading}
                                className="bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-200 gap-2"
                            >
                                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
                                Analyze Team Health
                            </Button>
                        )}
                    </CardHeader>
                    <CardContent>
                        {error && (
                            <div className="p-4 rounded-xl bg-rose-50 border border-rose-100 flex items-center gap-3 text-rose-700 mb-6">
                                <AlertCircle className="w-5 h-5" />
                                <p className="font-medium">{error}</p>
                            </div>
                        )}

                        {!report && !loading && !error && (
                            <div className="text-center py-16 border-2 border-dashed border-emerald-100 rounded-3xl bg-white/50">
                                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Users className="w-8 h-8 text-emerald-600" />
                                </div>
                                <h3 className="text-lg font-bold text-emerald-950">No report generated yet</h3>
                                <p className="text-emerald-700/60 max-w-xs mx-auto mt-2">
                                    Click the button above to analyze member records and generate a comprehensive safety summary.
                                </p>
                            </div>
                        )}

                        {loading && (
                            <div className="text-center py-16">
                                <div className="relative w-20 h-20 mx-auto mb-6">
                                    <div className="absolute inset-0 border-4 border-emerald-100 rounded-full"></div>
                                    <div className="absolute inset-0 border-4 border-t-emerald-600 rounded-full animate-spin"></div>
                                    <Stethoscope className="absolute inset-0 m-auto w-8 h-8 text-emerald-600" />
                                </div>
                                <h3 className="text-lg font-bold text-emerald-950">AI is analyzing health data...</h3>
                                <p className="text-emerald-700/60">This takes about 5-10 seconds.</p>
                            </div>
                        )}

                        {report && (
                            <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center gap-3 text-emerald-700 animate-in fade-in zoom-in duration-300">
                                <CheckCircle2 className="w-5 h-5" />
                                <p className="font-medium">Analytics successful! A copy has been securely archived in the team medical records.</p>
                            </div>
                        )}

                        {report && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="p-8 rounded-3xl bg-white border border-emerald-100 shadow-sm relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                        <CheckCircle2 className="w-24 h-24 text-emerald-600" />
                                    </div>
                                    <h4 className="text-sm font-black uppercase tracking-widest text-emerald-600 mb-4">Intelligence Summary</h4>
                                    <div className="prose prose-emerald max-w-none text-emerald-950 font-medium leading-relaxed">
                                        {(report?.summary || "No report generated yet").split('\n').map((line, i) => (
                                            <p key={i} className="mb-2">{line}</p>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <Button onClick={downloadPDF} className="flex-1 bg-emerald-900 hover:bg-emerald-950 gap-2 h-12 rounded-xl shadow-xl shadow-emerald-900/10">
                                        <Download className="w-4 h-4" />
                                        Download PDF Report
                                    </Button>
                                    <Button variant="outline" onClick={generateReport} className="h-12 px-6 rounded-xl border-emerald-200 text-emerald-700 hover:bg-emerald-50">
                                        <RefreshCw className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </PageShell>
    );
}
