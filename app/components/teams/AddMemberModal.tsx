'use client';

import { useState } from 'react';
import { useTranslation } from '@/app/hooks/useTranslation';
import { createClient } from '@/lib/supabase/client';
import { X, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface AddMemberModalProps {
  teamId: string;
  isOpen: boolean;
  onClose: () => void;
  onMemberAdded: () => void;
}

export function AddMemberModal({ teamId, isOpen, onClose, onMemberAdded }: AddMemberModalProps) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    full_name: '',
    date_of_birth: '',
    parent_name: '',
    parent_phone: '',
    parent_email: '',
  });

  const resetForm = () => {
    setFormData({
      full_name: '',
      date_of_birth: '',
      parent_name: '',
      parent_phone: '',
      parent_email: '',
    });
    setError(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();

      const { error: insertError } = await supabase
        .from('team_members')
        .insert({
          team_id: teamId,
          full_name: formData.full_name,
          date_of_birth: formData.date_of_birth || null,
          parent_name: formData.parent_name || null,
          parent_phone: formData.parent_phone || null,
          parent_email: formData.parent_email || null,
        });

      if (insertError) {
        console.error('Error adding member:', insertError);
        setError(t('dashboard.teams.memberCreateError'));
        setLoading(false);
        return;
      }

      // Success - close modal and refresh data
      resetForm();
      onMemberAdded();
      onClose();
    } catch (err) {
      console.error('Error:', err);
      setError(t('dashboard.teams.memberCreateError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-primary" />
            </div>
            <div>
              <DialogTitle>{t('dashboard.teams.addMemberTitle')}</DialogTitle>
              <DialogDescription>{t('dashboard.teams.addMemberDescription')}</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {error && (
          <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
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
            <Label htmlFor="parent_name">{t('dashboard.teams.parentName')}</Label>
            <Input
              id="parent_name"
              value={formData.parent_name}
              onChange={(e) => setFormData({ ...formData, parent_name: e.target.value })}
              placeholder={t('dashboard.teams.parentNamePlaceholder')}
              dir="auto"
            />
          </div>

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

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
              className="flex-1"
            >
              {t('common.actions.cancel')}
            </Button>
            <Button 
              type="submit" 
              disabled={loading || !formData.full_name} 
              className="flex-1"
            >
              {loading ? t('common.actions.saving') : t('dashboard.teams.saveMember')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
