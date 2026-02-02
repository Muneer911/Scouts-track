'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { PageShell } from '@/app/components/dashboard/PageShell';
import { useTranslation } from '@/app/hooks/useTranslation';
import { createMember } from '@/app/actions/members';
import { ArrowLeft, UserPlus, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function NewMemberPage() {
  const { t } = useTranslation();
  const params = useParams();
  const router = useRouter();
  const teamId = params.teamId as string;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    // Basic Info
    full_name: '',
    date_of_birth: '',
    gender: '',
    nationality: '',

    // Contact Info
    parent_name: '',
    parent_phone: '',
    parent_email: '',
    emergency_contact: '',
    emergency_phone: '',
    address: '',

    // Medical Info
    blood_type: '',
    allergies: '',
    medications: '',
    medical_conditions: '',
    insurance_provider: '',
    insurance_number: '',
    doctor_name: '',
    doctor_phone: '',

    // Additional Info
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const memberData = {
        full_name: formData.full_name,
        date_of_birth: formData.date_of_birth || null,
        gender: formData.gender || null,
        nationality: formData.nationality || null,
        parent_name: formData.parent_name || null,
        parent_phone: formData.parent_phone || null,
        parent_email: formData.parent_email || null,
        emergency_contact: formData.emergency_contact || null,
        emergency_phone: formData.emergency_phone || null,
        address: formData.address || null,
        notes: formData.notes || null,
      };

      const medicalData = (formData.blood_type || formData.allergies || formData.medications || formData.medical_conditions) ? {
        blood_type: formData.blood_type || null,
        allergies: formData.allergies || null,
        medications: formData.medications || null,
        medical_conditions: formData.medical_conditions || null,
        insurance_provider: formData.insurance_provider || null,
        insurance_number: formData.insurance_number || null,
        doctor_name: formData.doctor_name || null,
        doctor_phone: formData.doctor_phone || null,
      } : undefined;

      const { member, error: createError } = await createMember(teamId, memberData, medicalData);

      if (createError) {
        setError(createError);
        setLoading(false);
        return;
      }

      router.push(`/dashboard/teams/${teamId}`);
    } catch (err) {
      console.error('Error:', err);
      setError(t('dashboard.teams.memberCreateError'));
      setLoading(false);
    }
  };

  return (
    <PageShell title={t('dashboard.teams.addMemberTitle')}>
      <Button
        variant="ghost"
        onClick={() => router.push(`/dashboard/teams/${teamId}`)}
        className="mb-6 gap-2"
      >
        <ArrowLeft className="w-4 h-4" />
        {t('dashboard.teams.backToTeam')}
      </Button>

      <div className="max-w-4xl">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <UserPlus className="w-6 h-6 text-primary" />
              </div>
              <div>
                <CardTitle>{t('dashboard.teams.addMemberTitle')}</CardTitle>
                <CardDescription>{t('dashboard.teams.addMemberDescription')}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-6 rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-6">
                  <TabsTrigger value="basic">{t('dashboard.teams.basicInfo')}</TabsTrigger>
                  <TabsTrigger value="contact">{t('dashboard.teams.contactInfo')}</TabsTrigger>
                  <TabsTrigger value="medical">{t('dashboard.teams.medicalInfo')}</TabsTrigger>
                </TabsList>

                {/* Basic Info Tab */}
                <TabsContent value="basic" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="full_name">{t('dashboard.teams.memberName')} *</Label>
                    <Input
                      id="full_name"
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      placeholder={t('dashboard.teams.memberNamePlaceholder')}
                      required
                      dir="auto"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="date_of_birth">{t('dashboard.teams.dateOfBirth')}</Label>
                      <Input
                        id="date_of_birth"
                        type="date"
                        value={formData.date_of_birth}
                        onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                        dir="ltr"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gender">{t('dashboard.teams.gender')}</Label>
                      <Input
                        id="gender"
                        value={formData.gender}
                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                        placeholder={t('dashboard.teams.genderPlaceholder')}
                        dir="auto"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nationality">{t('dashboard.teams.nationality')}</Label>
                    <Input
                      id="nationality"
                      value={formData.nationality}
                      onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                      placeholder={t('dashboard.teams.nationalityPlaceholder')}
                      dir="auto"
                    />
                  </div>
                </TabsContent>

                {/* Contact Info Tab */}
                <TabsContent value="contact" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="parent_name">{t('dashboard.teams.parentName')}</Label>
                    <Input
                      id="parent_name"
                      value={formData.parent_name}
                      onChange={(e) => setFormData({ ...formData, parent_name: e.target.value })}
                      placeholder={t('dashboard.teams.parentNamePlaceholder')}
                      dir="auto"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="parent_phone">{t('dashboard.teams.parentPhone')}</Label>
                      <Input
                        id="parent_phone"
                        type="tel"
                        value={formData.parent_phone}
                        onChange={(e) => setFormData({ ...formData, parent_phone: e.target.value })}
                        placeholder={t('dashboard.teams.parentPhonePlaceholder')}
                        dir="ltr"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="parent_email">{t('dashboard.teams.parentEmail')}</Label>
                      <Input
                        id="parent_email"
                        type="email"
                        value={formData.parent_email}
                        onChange={(e) => setFormData({ ...formData, parent_email: e.target.value })}
                        placeholder={t('dashboard.teams.parentEmailPlaceholder')}
                        dir="ltr"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="emergency_contact">{t('dashboard.teams.emergencyContact')}</Label>
                      <Input
                        id="emergency_contact"
                        value={formData.emergency_contact}
                        onChange={(e) => setFormData({ ...formData, emergency_contact: e.target.value })}
                        placeholder={t('dashboard.teams.emergencyContactPlaceholder')}
                        dir="auto"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="emergency_phone">{t('dashboard.teams.emergencyPhone')}</Label>
                      <Input
                        id="emergency_phone"
                        type="tel"
                        value={formData.emergency_phone}
                        onChange={(e) => setFormData({ ...formData, emergency_phone: e.target.value })}
                        placeholder={t('dashboard.teams.emergencyPhonePlaceholder')}
                        dir="ltr"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">{t('dashboard.teams.address')}</Label>
                    <Textarea
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder={t('dashboard.teams.addressPlaceholder')}
                      rows={3}
                      dir="auto"
                    />
                  </div>
                </TabsContent>

                {/* Medical Info Tab */}
                <TabsContent value="medical" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="blood_type">{t('dashboard.medical.bloodType')}</Label>
                      <Input
                        id="blood_type"
                        value={formData.blood_type}
                        onChange={(e) => setFormData({ ...formData, blood_type: e.target.value })}
                        placeholder="A+"
                        dir="ltr"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="insurance_provider">{t('dashboard.medical.insuranceProvider')}</Label>
                      <Input
                        id="insurance_provider"
                        value={formData.insurance_provider}
                        onChange={(e) => setFormData({ ...formData, insurance_provider: e.target.value })}
                        placeholder={t('dashboard.medical.insuranceProviderPlaceholder')}
                        dir="auto"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="insurance_number">{t('dashboard.medical.insuranceNumber')}</Label>
                    <Input
                      id="insurance_number"
                      value={formData.insurance_number}
                      onChange={(e) => setFormData({ ...formData, insurance_number: e.target.value })}
                      placeholder={t('dashboard.medical.insuranceNumberPlaceholder')}
                      dir="ltr"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="allergies">{t('dashboard.medical.allergies')}</Label>
                    <Textarea
                      id="allergies"
                      value={formData.allergies}
                      onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                      placeholder={t('dashboard.medical.allergiesPlaceholder')}
                      rows={2}
                      dir="auto"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="medications">{t('dashboard.medical.medications')}</Label>
                    <Textarea
                      id="medications"
                      value={formData.medications}
                      onChange={(e) => setFormData({ ...formData, medications: e.target.value })}
                      placeholder={t('dashboard.medical.medicationsPlaceholder')}
                      rows={2}
                      dir="auto"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="medical_conditions">{t('dashboard.medical.medicalConditions')}</Label>
                    <Textarea
                      id="medical_conditions"
                      value={formData.medical_conditions}
                      onChange={(e) => setFormData({ ...formData, medical_conditions: e.target.value })}
                      placeholder={t('dashboard.medical.medicalConditionsPlaceholder')}
                      rows={2}
                      dir="auto"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="doctor_name">{t('dashboard.medical.doctorName')}</Label>
                      <Input
                        id="doctor_name"
                        value={formData.doctor_name}
                        onChange={(e) => setFormData({ ...formData, doctor_name: e.target.value })}
                        placeholder={t('dashboard.medical.doctorNamePlaceholder')}
                        dir="auto"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="doctor_phone">{t('dashboard.medical.doctorPhone')}</Label>
                      <Input
                        id="doctor_phone"
                        type="tel"
                        value={formData.doctor_phone}
                        onChange={(e) => setFormData({ ...formData, doctor_phone: e.target.value })}
                        placeholder={t('dashboard.medical.doctorPhonePlaceholder')}
                        dir="ltr"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">{t('dashboard.teams.notes')}</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder={t('dashboard.teams.notesPlaceholder')}
                      rows={3}
                      dir="auto"
                    />
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex gap-3 pt-6 border-t mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push(`/dashboard/teams/${teamId}`)}
                  disabled={loading}
                >
                  {t('common.actions.cancel')}
                </Button>
                <Button type="submit" disabled={loading || !formData.full_name} className="gap-2">
                  <Save className="w-4 h-4" />
                  {loading ? t('common.actions.saving') : t('dashboard.teams.saveMember')}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}
