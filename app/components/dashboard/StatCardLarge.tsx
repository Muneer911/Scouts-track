'use client';

import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown, LucideIcon } from 'lucide-react';

interface StatCardLargeProps {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  trend?: {
    value: string;
    direction: 'up' | 'down';
  };
  className?: string;
}

export function StatCardLarge({ label, value, icon: Icon, trend, className }: StatCardLargeProps) {
  return (
    <Card className={cn('bg-card', className)}>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          {Icon && (
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Icon className="w-5 h-5 text-primary" />
            </div>
          )}
          <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-foreground">{value}</span>
              {trend && (
                <span className={cn(
                  'text-xs flex items-center',
                  trend.direction === 'up' ? 'text-emerald-500' : 'text-red-500'
                )}>
                  {trend.direction === 'up' ? (
                    <TrendingUp className="w-3 h-3 mr-0.5" />
                  ) : (
                    <TrendingDown className="w-3 h-3 mr-0.5" />
                  )}
                  {trend.value}
                </span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
