'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { PageShell } from '@/app/components/dashboard/PageShell';
import { useTranslation } from '@/app/hooks/useTranslation';
import { getMemberById } from '@/app/actions/members';
import {
    ArrowLeft,
    User,
    Phone,
    Mail,
    Calendar,
    Heart,
    Activity,
    ShieldAlert,
    MapPin,
    Flag,
    Venus,
    Mars
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/app/components/ui/loading-spinner';

interface Scout {
    id: string;
    full_name: string;
    date_of_birth: string | null;
    gender: string | null;
    nationality: string | null;
    address: string | null;
    parent_name: string | null;
    parent_phone: string | null;
    parent_email: string | null;
    emergency_contact: string | null;
    emergency_phone: string | null;
    doctor_name: string | null;
    doctor_phone: string | null;
    blood_type: string | null;
    allergies: string | null;
    medical_conditions: string | null;
    notes: string | null;
}

export default function ScoutDetailPage() {
    const { t } = useTranslation();
    const params = useParams();
    const router = useRouter();
    const { teamId, scoutId } = params;

    const [scout, setScout] = useState<Scout | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchScoutData() {
            const { member, error } = await getMemberById(scoutId as string);

            if (error) {
                console.error('Error fetching scout:', error);
            } else {
                setScout(member);
            }
            setLoading(false);
        }

        fetchScoutData();
    }, [scoutId]);

    if (loading) {
        return (
            <PageShell title="Scout Profile">
                <LoadingSpinner />
            </PageShell>
        );
    }

    if (!scout) {
        return (
            <PageShell title="Scout Profile">
                <div className="text-center py-12">
                    <p className="text-muted-foreground">Scout not found</p>
                    <Button onClick={() => router.back()} className="mt-4">Go Back</Button>
                </div>
            </PageShell>
        );
    }

    return (
        <PageShell title={scout.full_name}>
            <div className="max-w-5xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b">
                    <div className="flex items-start gap-6">
                        <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center border-2 border-primary/20 shadow-inner">
                            <User className="w-12 h-12 text-primary" />
                        </div>
                        <div className="space-y-1">
                            <div className="flex items-center gap-3">
                                <h1 className="text-4xl font-black tracking-tight text-foreground">{scout.full_name}</h1>
                                <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">Active Scout</Badge>
                            </div>
                            <div className="flex flex-wrap gap-4 text-muted-foreground">
                                <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-primary/60" /> {scout.date_of_birth ? new Date(scout.date_of_birth).toLocaleDateString() : '—'}</span>
                                <span className="flex items-center gap-1.5"><Activity className="w-4 h-4 text-primary/60" /> {scout.blood_type || '—'}</span>
                                <span className="flex items-center gap-1.5">{scout.gender === 'Male' ? <Mars className="w-4 h-4 text-blue-500/60" /> : <Venus className="w-4 h-4 text-pink-500/60" />} {scout.gender || '—'}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline" onClick={() => router.back()} className="gap-2 shadow-sm">
                            <ArrowLeft className="w-4 h-4" /> Back to Team
                        </Button>
                        <Button className="gap-2 shadow-md shadow-primary/20 bg-primary hover:bg-primary/90 transition-all">
                            Edit Profile
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Info Columns */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Personal & Contact */}
                        <Card className="border-none shadow-xl shadow-black/[0.03] overflow-hidden bg-gradient-to-br from-white to-slate-50/50">
                            <CardHeader className="bg-white/50 border-b border-black/[0.03]">
                                <CardTitle className="text-xl flex items-center gap-2"><MapPin className="w-5 h-5 text-primary" /> Information & Contacts</CardTitle>
                            </CardHeader>
                            <CardContent className="p-8 grid md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div>
                                        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/60 block mb-2">Address</label>
                                        <p className="text-foreground leading-relaxed font-medium">{scout.address || 'Not provided'}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/60 block mb-2">Nationality</label>
                                        <div className="flex items-center gap-2 font-medium">
                                            <Flag className="w-4 h-4 text-muted-foreground" />
                                            {scout.nationality || 'Not specified'}
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <div className="p-4 rounded-2xl bg-white border border-black/[0.05] shadow-sm">
                                        <label className="text-xs font-bold uppercase tracking-wider text-primary/60 block mb-2">Parent / Guardian</label>
                                        <p className="font-bold text-lg mb-1">{scout.parent_name || '—'}</p>
                                        <div className="space-y-1.5 text-sm">
                                            <p className="flex items-center gap-2 transition-colors hover:text-primary cursor-pointer"><Phone className="w-4 h-4 text-primary/40" /> {scout.parent_phone || '—'}</p>
                                            <p className="flex items-center gap-2 transition-colors hover:text-primary cursor-pointer"><Mail className="w-4 h-4 text-primary/40" /> {scout.parent_email || '—'}</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Medical Section */}
                        <Card className="border-none shadow-xl shadow-black/[0.03] overflow-hidden bg-gradient-to-br from-white to-rose-50/20">
                            <CardHeader className="bg-white/50 border-b border-black/[0.03]">
                                <CardTitle className="text-xl flex items-center gap-2 font-bold text-rose-600"><Heart className="w-5 h-5" /> Medical Profile</CardTitle>
                            </CardHeader>
                            <CardContent className="p-8">
                                <div className="grid md:grid-cols-2 gap-10">
                                    <div className="space-y-8">
                                        <div className="relative pl-6 border-l-2 border-rose-200">
                                            <label className="text-xs font-bold uppercase tracking-wider text-rose-500/60 block mb-1.5">Allergies</label>
                                            <p className="text-foreground text-lg leading-relaxed font-semibold">
                                                {scout.allergies === 'None' || !scout.allergies ?
                                                    <span className="text-slate-400 font-medium italic">No known allergies</span> :
                                                    <span className="text-rose-700">{scout.allergies}</span>
                                                }
                                            </p>
                                        </div>
                                        <div className="relative pl-6 border-l-2 border-slate-200">
                                            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/60 block mb-1.5">Blood Type</label>
                                            <p className="text-foreground text-2xl font-black text-rose-600 font-mono tracking-tighter">{scout.blood_type || '—'}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-8">
                                        <div className="relative pl-6 border-l-2 border-amber-200">
                                            <label className="text-xs font-bold uppercase tracking-wider text-amber-600/60 block mb-1.5">Chronic conditions</label>
                                            <p className="text-foreground text-lg leading-relaxed font-semibold">
                                                {scout.medical_conditions === 'None' || !scout.medical_conditions ?
                                                    <span className="text-slate-400 font-medium italic">General good health</span> :
                                                    <span className="text-amber-700">{scout.medical_conditions}</span>
                                                }
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar Info */}
                    <div className="space-y-6">
                        {/* Emergency Info Sidebar */}
                        <Card className="border-none shadow-xl shadow-red-500/[0.05] bg-rose-600 text-white overflow-hidden">
                            <CardHeader className="border-b border-white/10 pb-4">
                                <CardTitle className="text-sm uppercase tracking-widest font-black flex items-center gap-2"><ShieldAlert className="w-5 h-5 animate-pulse" /> Emergency Rapid Contact</CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 space-y-6">
                                <div>
                                    <p className="text-rose-100 text-xs font-bold uppercase tracking-tight mb-1">Emergency Contact Person</p>
                                    <p className="text-xl font-bold">{scout.emergency_contact || '—'}</p>
                                </div>
                                <div className="p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                                    <p className="text-rose-100 text-xs font-bold uppercase mb-1">Call Representative</p>
                                    <p className="text-2xl font-black font-mono tracking-tight">{scout.emergency_phone || '—'}</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Doctor Info */}
                        <Card className="border-none shadow-xl shadow-black/[0.03] bg-emerald-50 content-overflow-hidden">
                            <CardHeader className="border-b border-emerald-100/50">
                                <CardTitle className="text-xs uppercase tracking-widest font-bold text-emerald-700 flex items-center gap-2"><Heart className="w-4 h-4" /> Family Physician</CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 space-y-4">
                                <div>
                                    <p className="text-emerald-700/60 text-xs font-bold uppercase mb-1">Primary Doctor</p>
                                    <p className="font-bold text-emerald-900">{scout.doctor_name || '—'}</p>
                                </div>
                                <div>
                                    <p className="text-emerald-700/60 text-xs font-bold uppercase mb-1">Doctor Contact</p>
                                    <p className="font-mono text-emerald-900">{scout.doctor_phone || '—'}</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* General Notes */}
                        <Card className="border-none shadow-xl shadow-black/[0.03]">
                            <CardHeader>
                                <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">General Notes</CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 pt-0">
                                <p className="text-sm italic text-muted-foreground leading-relaxed">
                                    {scout.notes || 'No additional notes registered for this scout.'}
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </PageShell>
    );
}
