'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from '@/app/hooks/useTranslation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { FolderPlus, RefreshCw } from 'lucide-react';

interface WorkspaceCreationModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (name: string) => void;
}

const adjectives = [
  'Cosmic',
  'Stellar',
  'Quantum',
  'Lunar',
  'Solar',
  'Nebula',
  'Aurora',
  'Phoenix',
  'Titan',
  'Nova',
  'Orion',
  'Vega',
  'Atlas',
  'Zenith',
  'Echo',
];

const nouns = [
  'Troop',
  'Pack',
  'Patrol',
  'Squad',
  'Unit',
  'Camp',
  'Lodge',
  'Den',
  'Crew',
  'Team',
  'Group',
  'Circle',
  'Band',
  'Guild',
  'Corps',
];

function generateRandomName(): string {
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  return `${adjective} ${noun}`;
}

export function WorkspaceCreationModal({ open, onClose, onCreate }: WorkspaceCreationModalProps) {
  const { t } = useTranslation();
  const [workspaceName, setWorkspaceName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setWorkspaceName(generateRandomName());
    }
  }, [open]);

  const handleRandomize = () => {
    setWorkspaceName(generateRandomName());
  };

  const handleCreate = () => {
    if (!workspaceName.trim()) return;

    setIsLoading(true);
    setTimeout(() => {
      onCreate(workspaceName.trim());
      setIsLoading(false);
    }, 500);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
            <FolderPlus className="w-6 h-6 text-primary" />
          </div>
          <DialogTitle className="text-foreground">
            {t('dashboard.workspace.createTitle')}
          </DialogTitle>
          <DialogDescription>
            {t('dashboard.workspace.createDesc')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="workspace-name" className="text-foreground">
              {t('dashboard.workspace.nameLabel')}
            </Label>
            <div className="flex gap-2">
              <Input
                id="workspace-name"
                value={workspaceName}
                onChange={(e) => setWorkspaceName(e.target.value)}
                placeholder={t('dashboard.workspace.namePlaceholder')}
                className="flex-1 bg-card"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && workspaceName.trim()) {
                    handleCreate();
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleRandomize}
                title={t('dashboard.workspace.randomize')}
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              {t('dashboard.workspace.randomizeHint')}
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            {t('common.cancel')}
          </Button>
          <Button
            onClick={handleCreate}
            disabled={!workspaceName.trim() || isLoading}
          >
            {isLoading ? t('dashboard.workspace.creating') : t('dashboard.workspace.create')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
